import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { withLayoutContext } from 'expo-router';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Dimensions, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { eachDayOfInterval, format, parseISO, subDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useDateStore } from '../../src/store/useDateStore';

const { Navigator } = createMaterialTopTabNavigator();
const TopTabs = withLayoutContext(Navigator);

const DIAS_SEMANA = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'];

// Divide o calendário em 7 dias
const SCREEN_WIDTH = Dimensions.get('window').width;
const VISIBLE_DAYS = 7;
const ITEM_WIDTH = SCREEN_WIDTH / VISIBLE_DAYS;

export default function HomeLayout() {
  const { selectedDate, setSelectedDate } = useDateStore();
  const flatListRef = useRef<FlatList>(null);

  // 365 dias no histórico
  const days = useMemo(() => {
    const today = new Date();
    const start = subDays(today, 365); 
    const end = today; // O limite é Hoje
    return eachDayOfInterval({ start, end });
  }, []);

  // Letreiro do mês com a data atual selecionada
  const [displayedMonth, setDisplayedMonth] = useState(() => {
    return format(parseISO(selectedDate), 'MMMM yyyy', { locale: ptBR }).toUpperCase();
  });

  // Quando o app abre, rola para o último dia (Hoje) e ancora na direita
  useEffect(() => {
    setTimeout(() => {
      flatListRef.current?.scrollToIndex({ 
        index: days.length - 1, 
        animated: true, 
        viewPosition: 1
      });
    }, 400);
  }, [days.length]);

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      // Pega o item que está bem no meio da visualização da tela
      const middleItem = viewableItems[Math.floor(viewableItems.length / 2)];
      if (middleItem && middleItem.item) {
        const monthName = format(middleItem.item, 'MMMM yyyy', { locale: ptBR }).toUpperCase();
        setDisplayedMonth(monthName);
      }
    }
  }).current;

  const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 50 }).current;
  const renderDay = ({ item, index }: { item: Date; index: number }) => {
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
            viewPosition: 1 
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
  };

  return (
    <SafeAreaView style={styles.container}>
      
      {/* HUD BÚSSOLA (CALENDÁRIO) */}
      <View style={styles.calendarContainer}>

        {/* Rótulo do Mês */}
        <Text style={styles.monthLabel}>{displayedMonth}</Text>

        <FlatList
          ref={flatListRef}
          data={days}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.toISOString()}
          renderItem={renderDay}
          // As duas linhas abaixo fazem a leitura do scroll sem travar a lista
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
          getItemLayout={(_, index) => ({ length: ITEM_WIDTH, offset: ITEM_WIDTH * index, index })}
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
        <TopTabs.Screen name="tasks" options={{ title: 'Tarefas' }} />
        <TopTabs.Screen name="index" options={{ title: 'Hábitos' }} />
        <TopTabs.Screen name="notes" options={{ title: 'Notas' }} />
      </TopTabs>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#121212' 
  },
  calendarContainer: {
    paddingTop: 16,
    backgroundColor: '#121212',
    position: 'relative', 
  },
  monthLabel: {
    color: 'rgba(255, 255, 255, 0.3)',
    fontSize: 10,
    fontWeight: '500',
    letterSpacing: 2,
    paddingHorizontal: 24,
    marginBottom: 0,
  },
  dayCard: {
    width: ITEM_WIDTH,
    height: 70,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingTop: 10,
  },
  dayOfWeek: {
    fontSize: 9,
    color: '#444444',
    fontWeight: 'bold',
    letterSpacing: 1,
    marginBottom: 4,
  },
  dayOfMonth: {
    fontSize: 20,
    color: '#555555',
    fontWeight: '500',
    marginBottom: 8,
  },
  textSelected: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  tick: {
    width: 2,
    height: 8,
    backgroundColor: '#2A2A2A',
    borderRadius: 2,
  },
  tickSelected: {
    backgroundColor: '#ffffff',
    height: 16, 
  },
  rulerBaseline: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: '#2A2A2A',
    zIndex: -1,
  }
});