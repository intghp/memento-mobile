import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useRouter, withLayoutContext } from 'expo-router';
import { MoreVertical } from 'lucide-react-native';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Dimensions, FlatList, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { eachDayOfInterval, format, parseISO, subDays } from 'date-fns';
import { enUS, ptBR } from 'date-fns/locale';
import { useTranslation } from 'react-i18next';
import { useDateStore } from '../../src/store/useDateStore';
import { useHabitStore } from '../../src/store/useHabitStore';

const { Navigator } = createMaterialTopTabNavigator();
const TopTabs = withLayoutContext(Navigator);

// Divide o calendário em 7 dias
const SCREEN_WIDTH = Dimensions.get('window').width;
const VISIBLE_DAYS = 7;
const ITEM_WIDTH = SCREEN_WIDTH / VISIBLE_DAYS;

export default function HomeLayout() {
  const { selectedDate, setSelectedDate } = useDateStore();
  const { fetchHabits } = useHabitStore();
  const flatListRef = useRef<FlatList>(null);
  const router = useRouter();
  const { t, i18n } = useTranslation();

  const dateLocale = i18n.language.startsWith('pt') ? ptBR : enUS;
  const weekDaysArray = t('home.week_days', { returnObjects: true });
  const DIAS_SEMANA = Array.isArray(weekDaysArray) ? weekDaysArray : ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'];

  // A MÁGICA 1: O array agora é gerado de trás pra frente. Hoje é o índice [0].
  const days = useMemo(() => {
    const today = new Date();
    const start = subDays(today, 365); 
    return eachDayOfInterval({ start, end: today }).reverse();
  }, []);

  useEffect(() => {
    const todayStr = format(new Date(), 'yyyy-MM-dd');
    if (selectedDate !== todayStr) {
      setSelectedDate(todayStr);
    }
    fetchHabits(todayStr);
  }, []);

// Letreiro do mês com a data atual selecionada
  const [displayedMonth, setDisplayedMonth] = useState(() => {
    const dateToParse = selectedDate || format(new Date(), 'yyyy-MM-dd');
    return format(parseISO(dateToParse), 'MMMM yyyy', { locale: dateLocale }).toUpperCase();
  });

  useEffect(() => {
    if (selectedDate) {
      setDisplayedMonth(format(parseISO(selectedDate), 'MMMM yyyy', { locale: dateLocale }).toUpperCase());
    }
  }, [i18n.language, selectedDate, dateLocale]);

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      // Pega o item que está bem no meio da visualização da tela
      const middleItem = viewableItems[Math.floor(viewableItems.length / 2)];
      if (middleItem && middleItem.item) {
        const monthName = format(middleItem.item, 'MMMM yyyy', { locale: dateLocale }).toUpperCase();
        setDisplayedMonth(prev => prev !== monthName ? monthName : prev);
      }
    }
  }).current;

  const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 50 }).current;
  
  const renderDay = useCallback(({ item, index }: { item: Date; index: number }) => {
    const dateString = format(item, 'yyyy-MM-dd');
    const isSelected = selectedDate === dateString;
    
    const dayOfWeek = DIAS_SEMANA[item.getDay()];
    const dayOfMonth = format(item, 'dd');

    return (
      <TouchableOpacity
        activeOpacity={0.7}
        style={styles.dayCard}
        onPress={() => {
          setSelectedDate(dateString);
          // Ao clicar, o dia selecionado vai para a ponta direita da tela!
          flatListRef.current?.scrollToIndex({ 
            index, 
            animated: true, 
            viewPosition: 0.5 
          });
        }}
      >
        <Text style={[styles.dayOfWeek, isSelected && styles.textSelected]}>
          {dayOfWeek}
        </Text>
        
        <Text style={[styles.dayOfMonth, isSelected && styles.textSelected]}>
          {dayOfMonth}
        </Text>
        
        <View style={[styles.tick, isSelected && styles.tickSelected]} />
      </TouchableOpacity>
    );
  }, [selectedDate, DIAS_SEMANA]);

  return (
    <SafeAreaView style={styles.container}>
      
      {/* APP BAR (CABEÇALHO MESTRE) */}
      <View style={styles.appBar}>
        <Text style={styles.appTitle}>Memento</Text>
        <View style={styles.appBarActions}>
          <TouchableOpacity style={styles.iconButton} onPress={() => router.push('/settings')}>
            <MoreVertical color="#ffffff" size={24} />
          </TouchableOpacity>
        </View>
      </View>

      {/* HUD BÚSSOLA (CALENDÁRIO) */}
      <View style={styles.calendarContainer}>

        {/* Rótulo do Mês */}
        <Text style={styles.monthLabel}>{displayedMonth}</Text>

        <FlatList
          ref={flatListRef}
          data={days}
          horizontal
          inverted
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.toISOString()}
          renderItem={renderDay}
          // As duas linhas abaixo fazem a leitura do scroll sem travar a lista
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
          getItemLayout={(_, index) => ({ length: ITEM_WIDTH, offset: ITEM_WIDTH * index, index })}
          initialNumToRender={10}               
          maxToRenderPerBatch={10}             
          windowSize={5}
          removeClippedSubviews={Platform.OS === 'android'}
        />
        {/* Linha de base da régua da bússola */}
        <View style={styles.rulerBaseline} />
      </View>

      {/* AS 3 ABAS DESLIZÁVEIS */}
      <TopTabs
        initialRouteName="index" // Começa na tela do meio (Hábitos)
        screenOptions={{
          tabBarStyle: { backgroundColor: '#121212', elevation: 0, shadowOpacity: 0 },
          tabBarIndicatorStyle: { backgroundColor: '#ffffff', height: 2 },
          tabBarActiveTintColor: '#ffffff',
          tabBarInactiveTintColor: '#555555',
          tabBarLabelStyle: { fontSize: 13, fontWeight: 'bold' },
        }}
      >
        <TopTabs.Screen name="tasks" options={{ title: t('home.tasks') }} />
        <TopTabs.Screen name="index" options={{ title: t('home.habits') }} />
        <TopTabs.Screen name="notes" options={{ title: t('home.notes') }} />
      </TopTabs>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },
  appBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingTop: 16, paddingBottom: 8, backgroundColor: '#121212' },
  appTitle: { fontSize: 24, fontWeight: 'bold', color: '#ffffff', letterSpacing: 0.5 },
  appBarActions: { flexDirection: 'row', alignItems: 'center' },
  iconButton: { marginLeft: 20, padding: 4 },
  calendarContainer: { paddingTop: 8, backgroundColor: '#121212', position: 'relative' },
  monthLabel: { color: 'rgba(255, 255, 255, 0.3)', fontSize: 10, fontWeight: '500', letterSpacing: 2, paddingHorizontal: 24, marginBottom: 0 },
  dayCard: { width: ITEM_WIDTH, height: 70, alignItems: 'center', justifyContent: 'flex-end', paddingTop: 10 },
  dayOfWeek: { fontSize: 9, color: '#444444', fontWeight: 'bold', letterSpacing: 1, marginBottom: 4 },
  dayOfMonth: { fontSize: 20, color: '#555555', fontWeight: '500', marginBottom: 8 },
  textSelected: { color: '#ffffff', fontWeight: 'bold' },
  tick: { width: 2, height: 8, backgroundColor: '#2A2A2A', borderRadius: 2 },
  tickSelected: { backgroundColor: '#ffffff', height: 16 },
  rulerBaseline: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 1, backgroundColor: '#2A2A2A', zIndex: -1 }
});