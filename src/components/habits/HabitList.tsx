import { format } from 'date-fns';
import { Activity, AlertTriangle, Apple, ArrowLeft, Baby, Bed, Bike, Book, BookOpen, Brain, Briefcase, Camera, Car, Check, Circle, Clock, Cloud, Code, Coffee, Compass, Cpu, CreditCard, Crosshair, Droplets, Dumbbell, Feather, Flag, Flame, Gamepad2, Gift, GraduationCap, Guitar, Headphones, Heart, Home, Image, Key, Leaf, Map, Mic, Minus, Monitor, Moon, Music, Palette, PenTool, Pill, Plane, Plus, Scissors, Shield, ShoppingBag, Smartphone, Smile, Speaker, Star, Sun, Target, Thermometer, Trash, Trash2, Trophy, Truck, Tv, Umbrella, Utensils, Video, Watch, Wifi, Wind, X, XCircle } from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, FlatList, KeyboardAvoidingView, Modal, Platform, ScrollView, SectionList, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useDateStore } from '../../store/useDateStore';
import { useHabitStore } from '../../store/useHabitStore';
import { Habit } from '../../types';
import { HabitMacroVision } from './heatmap/HabitMacroVision';
import { styles } from './styles';

const HABIT_COLORS = [
  '#F44336', '#E91E63', '#9C27B0', '#673AB7', '#3F51B5', '#2196F3', '#03A9F4', '#00BCD4', '#009688', '#4CAF50', '#8BC34A', '#CDDC39', '#FFEB3B', '#FFC107', '#FF9800', '#FF5722', '#795548', '#9E9E9E', '#607D8B',
  '#D32F2F', '#C2185B', '#7B1FA2', '#512DA8', '#303F9F', '#1976D2', '#0288D1', '#0097A7', '#00796B', '#388E3C', '#689F38', '#AFB42B', '#FBC02D', '#FFA000', '#F57C00', '#E64A19', '#5D4037', '#616161', '#455A64',
  '#FF8A80', '#FF80AB', '#EA80FC', '#B388FF', '#8C9EFF', '#82B1FF', '#80D8FF', '#84FFFF', '#A7FFEB', '#B9F6CA', '#CCFF90', '#F4FF81', '#FFFF8D', '#FFE57F', '#FFD180', '#FF9E80'
];

const ICON_MAP: Record<string, any> = {
  Activity, Dumbbell, Bed, Droplets, Apple, Coffee, Pill, Heart, Brain, Clock, Book, GraduationCap, Briefcase, Code, Target, XCircle,
  Bike, Utensils, Home, Baby, Smile, Gamepad2, Tv, Video, Music, Guitar, Palette, PenTool, Star, Sun, Moon, Flame, Leaf, BookOpen, ShoppingBag, Car,
  Plane, Compass, Map, Headphones, Speaker, Mic, Smartphone, Gift, Trophy,
  Watch, Thermometer, Shield, CreditCard, Cpu, Monitor, Camera, Image, Feather, Flag, Crosshair, Umbrella, Cloud, Wind, Key, Wifi, Truck, Scissors, Trash,
};

export default function HabitsList() {
  const { selectedDate } = useDateStore();
  const { habits, fetchHabits, fetchHabitLogs, clearHabitLogs, addHabit, updateHabit, toggleHabitStatus, updateHabitProgress, deleteHabit } = useHabitStore();

  // Estados do Modal de Adicionar Hábito
  const [isModalVisible, setModalVisible] = useState(false);
  const [modalStep, setModalStep] = useState<'main' | 'color' | 'icon'>('main');
  const [editingHabitId, setEditingHabitId] = useState<number | null>(null);
  
  const [newHabitName, setNewHabitName] = useState('');
  const [newHabitShift, setNewHabitShift] = useState('Qualquer'); 
  const [selectedColor, setSelectedColor] = useState(HABIT_COLORS[9]);
  const [selectedIcon, setSelectedIcon] = useState('Activity');

  const [isQuantitative, setIsQuantitative] = useState(false);
  const [goalAmount, setGoalAmount] = useState('');
  const [unit, setUnit] = useState('');

  const [progressHabit, setProgressHabit] = useState<Habit | null>(null);
  const [progressInput, setProgressInput] = useState('');
  
  const [heatmapHabit, setHeatmapHabit] = useState<Habit | null>(null);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const [isEveryday, setIsEveryday] = useState(true);
  const [activeDays, setActiveDays] = useState<number[]>([0, 1, 2, 3, 4, 5, 6]);

  const fadeAnim = useRef(new Animated.Value(1)).current;
  const shiftAnim = useRef(new Animated.Value(0)).current;
  const [segmentWidth, setSegmentWidth] = useState(0);

  const todayDateString = format(new Date(), 'yyyy-MM-dd');
  const isPastDay = selectedDate < todayDateString;

  const SHIFTS = ['Qualquer', 'Manhã', 'Tarde', 'Noite'];

  // 1. Sempre que a data (Calendário) mudar, busca os hábitos atualizados
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 50,
      useNativeDriver: true,
    }).start(() => {
      fetchHabits(selectedDate).then(() => {
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }).start();
      });
    });
  }, [selectedDate]);

  useEffect(() => {
    const index = SHIFTS.indexOf(newHabitShift);
    Animated.timing(shiftAnim, {
      toValue: index !== -1 ? index : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [newHabitShift]);

  // 2. Transforma a lista plana do banco em Seções (Manhã, Tarde, Noite)
  const getSections = () => {
    const qualquer = habits.filter(h => h.shift === 'Qualquer');
    const manha = habits.filter(h => h.shift === 'Manhã');
    const tarde = habits.filter(h => h.shift === 'Tarde');
    const noite = habits.filter(h => h.shift === 'Noite');

    const sections = [];
    if (qualquer.length > 0) sections.push({ title: '✨ Geral', data: qualquer });
    if (manha.length > 0) sections.push({ title: '☀️ Manhã', data: manha });
    if (tarde.length > 0) sections.push({ title: '🌤️ Tarde', data: tarde });
    if (noite.length > 0) sections.push({ title: '🌙 Noite', data: noite });

    return sections;
  };

  const resetModal = () => {
    setNewHabitName('');
    setNewHabitShift('Qualquer');
    setSelectedColor(HABIT_COLORS[9]);
    setSelectedIcon('Activity');
    setIsQuantitative(false);
    setGoalAmount('');
    setUnit('');
    setEditingHabitId(null);
    setModalStep('main');
    setShowDeleteConfirm(false);
    setIsEveryday(true);
    setActiveDays([0, 1, 2, 3, 4, 5, 6]);
    setModalVisible(false);
  };

  const openEditModal = (habit: Habit) => {
    setNewHabitName(habit.name);
    setNewHabitShift(habit.shift || 'Qualquer');
    setSelectedColor(habit.color);
    setSelectedIcon(habit.icon);
    setIsQuantitative(!!habit.is_quantitative);
    setGoalAmount(habit.goal_amount ? habit.goal_amount.toString() : '');
    setUnit(habit.unit || '');
    setEditingHabitId(habit.id);
    setModalStep('main');
    setShowDeleteConfirm(false);
    
    if (habit.specific_days) {
      setIsEveryday(false);
      const parsedDays = habit.specific_days.split(',').map(Number);
      setActiveDays(parsedDays);
    } else {
      setIsEveryday(true);
      setActiveDays([0, 1, 2, 3, 4, 5, 6]);
    }
    
    setModalVisible(true);
  };

  // 3. Função para salvar o novo hábito
  const handleSaveHabit = async () => {
    if (newHabitName.trim() === '') return;
    
    const goalNum = isQuantitative ? parseFloat(goalAmount.replace(',', '.')) : null;
    const daysString = isEveryday ? null : activeDays.sort().join(',');

    if (editingHabitId) {
      await updateHabit(editingHabitId, {
        name: newHabitName,
        shift: newHabitShift,
        color: selectedColor,
        icon: selectedIcon,
        is_quantitative: isQuantitative,
        goal_amount: goalNum,
        unit: isQuantitative ? unit : null,
        specific_days: daysString
      }, selectedDate);
    } else {
      await addHabit({
        name: newHabitName,
        frequency: 'Diário',
        specific_days: daysString,
        shift: newHabitShift,
        is_quantitative: isQuantitative,
        goal_amount: goalNum,
        unit: isQuantitative ? unit : null,
        color: selectedColor,
        icon: selectedIcon
      }, selectedDate);
    }

    resetModal();
  };

  const executeDelete = () => {
    if (editingHabitId) {
      deleteHabit(editingHabitId, selectedDate);
      resetModal();
    }
  };

  const sections = getSections();
  const SelectedIconComponent = ICON_MAP[selectedIcon] || Activity;

  return (
    <View style={styles.container}>
      
      <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
        {/* LISTA DE HÁBITOS (Se vazia, mostra mensagem, se não, mostra as seções) */}
        {sections.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Nenhum hábito para hoje.</Text>
            <Text style={styles.emptySubText}>Clique no + para criar ou editar sua jornada.</Text>
          </View>
        ) : (
          <SectionList
            sections={sections}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            renderSectionHeader={({ section: { title } }) => (
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>{title}</Text>
                <View style={styles.sectionLine} />
              </View>
            )}
            renderItem={({ item }) => {
              const isCompleted = item.is_completed === 1;
              const isFailed = item.is_completed === -1;
              const isSkipped = item.is_skipped === 1;
              
              const isQuant = !!item.is_quantitative;
              const currentAmount = item.amount_completed || 0;
              const unitLabel = item.unit || '';

              const progressPercent = isQuant && item.goal_amount ? Math.min(100, (currentAmount / item.goal_amount) * 100) : 0;
              const hasPartialProgress = isQuant && currentAmount > 0 && !isCompleted && !isSkipped;

              const isFaded = isFailed || (isPastDay && !isCompleted && !isSkipped && !hasPartialProgress);
              const isColored = isCompleted || isSkipped || hasPartialProgress;

              const IconComponent = ICON_MAP[item.icon] || Activity;
              
              let RightIcon = Circle;
              let rightIconColor = '#333';

              if (isCompleted) {
                RightIcon = Check;
                rightIconColor = item.color;
              } else if (isSkipped) {
                RightIcon = Minus;
                rightIconColor = item.color;
              } else if (isFailed || (isPastDay && !isCompleted && !isSkipped && !hasPartialProgress)) {
                RightIcon = X;
                rightIconColor = '#555555';
              }

              return (
                <View style={styles.habitRow}>             
                  {/* Esquerda: Ícone Genérico e Nome */}
                  <TouchableOpacity 
                    activeOpacity={0.7} 
                    style={styles.leftContent}
                    onPress={async () => {
                      clearHabitLogs();             
                      await fetchHabitLogs(item.id);
                      setHeatmapHabit(item);
                    }} 
                    onLongPress={() => openEditModal(item)}
                  >
                    <View style={[styles.iconWrapper, { borderColor: isColored ? item.color : '#333' }]}>
                      <IconComponent color={isColored ? item.color : '#555'} size={16} />
                    </View>
                    <Text style={[styles.habitName, isFaded && styles.habitNameFaded]}>
                      {item.name}
                    </Text>
                  </TouchableOpacity>

                  {/* Direita: Check ou Círculo Vazio */}
                  <TouchableOpacity 
                    activeOpacity={0.7} 
                    style={styles.rightContent}
                    // Ao clicar na linha, marca ou desmarca o hábito neste dia!
                    onPress={() => {
                      if (isQuant) {
                        setProgressHabit(item);
                        setProgressInput(currentAmount > 0 ? currentAmount.toString().replace('.', ',') : '');
                      } else {
                        toggleHabitStatus(item.id, selectedDate, item.is_completed, item.is_skipped);
                      }
                    }}
                  >
                    {isQuant ? (
                      <View style={[styles.quantRight, { width: '100%' }]}>
                        <Text style={[styles.quantAmount, { color: isColored ? item.color : (isFaded ? '#555' : '#888') }]}>
                          {currentAmount.toString().replace('.', ',')}
                        </Text>
                        {!!unitLabel && (
                          <Text style={[styles.quantUnit, isFaded && { color: '#444' }]}>{unitLabel}</Text>
                        )}
                        
                        {!isCompleted && !isSkipped && !isFailed && (
                          <View style={{ width: '100%', height: 3, backgroundColor: '#2A2A2A', borderRadius: 2, marginTop: 4, overflow: 'hidden' }}>
                            <View style={{ width: `${progressPercent}%`, height: '100%', backgroundColor: item.color }} />
                          </View>
                        )}
                      </View>
                    ) : (
                      (isCompleted || isSkipped || isFailed || (isPastDay && !hasPartialProgress)) ? (
                        <RightIcon color={rightIconColor} size={24} strokeWidth={3} />
                      ) : (
                        <Circle color="#2A2A2A" size={24} />
                      )
                    )}
                  </TouchableOpacity>
                  
                </View>
              );
            }}
          />
        )}
      </Animated.View>

      {/* BOTÃO FLUTUANTE DE ADICIONAR */}
      <TouchableOpacity 
        style={styles.fab} 
        activeOpacity={0.8}
        onPress={() => {
          resetModal();
          setModalVisible(true);
        }}
      >
        <Plus color="#121212" size={28} />
      </TouchableOpacity>

      <HabitMacroVision 
        habit={heatmapHabit} 
        onClose={() => setHeatmapHabit(null)} 
      />

      <Modal visible={!!progressHabit} transparent={true} animationType="fade" onRequestClose={() => setProgressHabit(null)}>
        <KeyboardAvoidingView style={styles.progressModalOverlay} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <View style={styles.progressModalContent}>
            <Text style={styles.progressModalTitle}>Registrar Progresso</Text>
            <Text style={styles.progressModalSub}>
              Meta: {progressHabit?.goal_amount} {progressHabit?.unit}
            </Text>

            <View style={styles.progressInputRow}>
              <TextInput
                style={styles.progressInput}
                keyboardType="numeric"
                autoFocus
                value={progressInput}
                onChangeText={setProgressInput}
                placeholder="0"
                placeholderTextColor="#555"
              />
              <Text style={styles.progressUnitText}>{progressHabit?.unit}</Text>
            </View>

            <View style={styles.progressButtons}>
              <TouchableOpacity style={styles.progressCancelBtn} onPress={() => setProgressHabit(null)}>
                <Text style={styles.progressCancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.progressSaveBtn, { backgroundColor: progressHabit?.color || '#ffffff' }]} onPress={() => {
                const amount = parseFloat(progressInput.replace(',', '.')) || 0;
                updateHabitProgress(progressHabit!.id, selectedDate, amount, progressHabit!.goal_amount);
                setProgressHabit(null);
              }}>
                <Text style={styles.progressSaveText}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      <Modal visible={showDeleteConfirm} transparent={true} animationType="fade" onRequestClose={() => setShowDeleteConfirm(false)}>
        <View style={styles.deleteModalOverlay}>
          <View style={styles.deleteModalContent}>
            <View style={styles.deleteModalHeader}>
              <AlertTriangle color="#D9534F" size={36} />
              <View style={styles.deleteModalTextContainer}>
                <Text style={styles.deleteModalTitle}>EXCLUIR HÁBITO</Text>
                <Text style={styles.deleteModalText}>Esta ação não pode ser desfeita.</Text>
              </View>
            </View>
            <View style={styles.deleteModalDivider} />
            <View style={styles.deleteModalButtons}>
              <TouchableOpacity style={styles.deleteCancelButton} onPress={() => setShowDeleteConfirm(false)}>
                <Text style={styles.deleteCancelText}>CANCELAR</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.deleteConfirmButton} onPress={executeDelete}>
                <Text style={styles.deleteConfirmText}>EXCLUIR</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* MODAL PRINCIPAL E SUBTELAS */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={resetModal}
      >
        <KeyboardAvoidingView 
          style={styles.fullScreenModalOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={styles.fullScreenModalContent}>
            
            {modalStep === 'main' && (
              <View style={{ flex: 1 }}>
                <View style={styles.fullScreenHeader}>
                  <TouchableOpacity onPress={resetModal} style={styles.headerIconButton}>
                    <ArrowLeft color="#fff" size={24} />
                  </TouchableOpacity>
                  <Text style={styles.fullScreenTitle}>{editingHabitId ? 'Editar hábito' : 'Novo hábito'}</Text>
                  <TouchableOpacity onPress={handleSaveHabit} style={styles.headerTextButton}>
                    <Text style={styles.headerSaveText}>SALVAR</Text>
                  </TouchableOpacity>
                </View>

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.fullScreenScrollContent}>
                  
                  <View style={styles.formRow}>
                    <View style={styles.inputGroupFlexible}>
                      <Text style={styles.label}>Nome</Text>
                      <View style={styles.nameInputContainer}>
                        <TouchableOpacity style={styles.nameIconSelector} onPress={() => setModalStep('icon')}>
                          <SelectedIconComponent color={selectedColor} size={20} />
                        </TouchableOpacity>
                        <TextInput
                          style={styles.nameInput}
                          placeholder="Nome do hábito..."
                          placeholderTextColor="#666"
                          value={newHabitName}
                          onChangeText={setNewHabitName}
                        />
                      </View>
                    </View>
                    
                    <View style={styles.inputGroupFixed}>
                      <Text style={styles.label}>Cor</Text>
                      <TouchableOpacity 
                        style={[styles.colorBox, { backgroundColor: selectedColor }]} 
                        onPress={() => setModalStep('color')}
                      />
                    </View>
                  </View>

                  <View style={styles.switchRow}>
                    <Text style={styles.labelSwitch}>Meta quantitativa?</Text>
                    <Switch
                      value={isQuantitative}
                      onValueChange={setIsQuantitative}
                      trackColor={{ false: '#2A2A2A', true: selectedColor }}
                      thumbColor={'#ffffff'}
                    />
                  </View>

                  {isQuantitative && (
                    <View style={styles.formRow}>
                      <View style={styles.inputGroupFlexible}>
                        <Text style={styles.label}>Meta (ex: 2.5)</Text>
                        <View style={styles.pillInputContainer}>
                          <TextInput
                            style={styles.pillInput}
                            placeholder="0.0"
                            placeholderTextColor="#666"
                            keyboardType="numeric"
                            value={goalAmount}
                            onChangeText={setGoalAmount}
                          />
                        </View>
                      </View>
                      
                      <View style={styles.inputGroupFlexible}>
                        <Text style={styles.label}>Unidade (ex: L)</Text>
                        <View style={styles.pillInputContainer}>
                          <TextInput
                            style={styles.pillInput}
                            placeholder="Litros, km..."
                            placeholderTextColor="#666"
                            value={unit}
                            onChangeText={setUnit}
                          />
                        </View>
                      </View>
                    </View>
                  )}

                  <View style={styles.frequencyHeader}>
                    <Text style={styles.label}>Frequência</Text>
                    <TouchableOpacity onPress={() => {
                      const nextStatus = !isEveryday;
                      setIsEveryday(nextStatus);
                      if (nextStatus) {
                        setActiveDays([0, 1, 2, 3, 4, 5, 6]);
                      } else {
                        setActiveDays([]);
                      }
                    }}>
                      <Text style={[styles.frequencyToggle, { color: selectedColor }]}>
                        {isEveryday ? 'Todo dia' : 'Dias específicos'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  
                  <View style={styles.minimalDaysRow}>
                    {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((day, index) => {
                      const isActive = activeDays.includes(index);
                      return (
                        <TouchableOpacity 
                          key={index} 
                          activeOpacity={0.7}
                          style={[
                            styles.minimalDayItem,
                            isActive && { backgroundColor: selectedColor }
                          ]}
                          onPress={() => {
                            setIsEveryday(false);
                            setActiveDays(prev => {
                              const newDays = prev.includes(index)
                                ? prev.filter(d => d !== index)
                                : [...prev, index];
                              
                              if (newDays.length === 7) setIsEveryday(true);
                              return newDays;
                            });
                          }}
                        >
                          <Text style={[
                            styles.minimalDayText, 
                            isActive ? { color: '#121212' } : { color: '#666666' }
                          ]}>
                            {day}
                          </Text>
                        </TouchableOpacity>
                      )
                    })}
                  </View>

                  <Text style={styles.label}>Turno</Text>
                  <View style={styles.diRadioWrap}>
                    <View 
                      style={styles.diRadioIsland}
                      onLayout={(e) => setSegmentWidth((e.nativeEvent.layout.width - 12) / 4)}
                    >
                      {segmentWidth > 0 && (
                        <Animated.View 
                          style={[
                            styles.diRadioIndicator, 
                            { 
                              width: segmentWidth, 
                              transform: [{ 
                                translateX: shiftAnim.interpolate({
                                  inputRange: [0, 1, 2, 3],
                                  outputRange: [0, segmentWidth, segmentWidth * 2, segmentWidth * 3]
                                })
                              }] 
                            }
                          ]} 
                        />
                      )}
                      {SHIFTS.map((shift) => (
                        <TouchableOpacity
                          key={shift}
                          activeOpacity={0.7}
                          style={styles.diRadioBtn}
                          onPress={() => setNewHabitShift(shift)}
                        >
                          <Text style={[styles.diRadioBtnText, newHabitShift === shift && styles.diRadioBtnTextActive]}>
                            {shift}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>

                  {editingHabitId && (
                    <TouchableOpacity style={styles.deleteHabitButton} onPress={() => setShowDeleteConfirm(true)}>
                      <Trash2 color="#FF5252" size={20} />
                      <Text style={styles.deleteHabitText}>Excluir hábito</Text>
                    </TouchableOpacity>
                  )}
                  
                </ScrollView>
              </View>
            )}

            {modalStep === 'color' && (
              <View style={{ flex: 1 }}>
                <View style={styles.fullScreenHeader}>
                  <TouchableOpacity onPress={() => setModalStep('main')} style={styles.headerIconButton}>
                    <ArrowLeft color="#fff" size={24} />
                  </TouchableOpacity>
                  <Text style={styles.fullScreenTitle}>Cor</Text>
                  <View style={{ width: 60 }} /> 
                </View>
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.fullScreenScrollContent}>
                  <View style={styles.gridContainer}>
                    {HABIT_COLORS.map(color => (
                      <TouchableOpacity 
                        key={color} 
                        style={[styles.gridColorCircle, { backgroundColor: color }, selectedColor === color && styles.gridColorCircleActive]}
                        onPress={() => {
                          setSelectedColor(color);
                          setModalStep('main');
                        }}
                      />
                    ))}
                  </View>
                </ScrollView>
              </View>
            )}

            {modalStep === 'icon' && (
              <View style={{ flex: 1 }}>
                <View style={styles.fullScreenHeader}>
                  <TouchableOpacity onPress={() => setModalStep('main')} style={styles.headerIconButton}>
                    <ArrowLeft color="#fff" size={24} />
                  </TouchableOpacity>
                  <Text style={styles.fullScreenTitle}>Ícone</Text>
                  <View style={{ width: 60 }} /> 
                </View>
                <FlatList
                  data={Object.keys(ICON_MAP)}
                  keyExtractor={(item) => item}
                  numColumns={4}
                  showsVerticalScrollIndicator={false}
                  columnWrapperStyle={styles.iconGridRow}
                  contentContainerStyle={styles.fullScreenScrollContent}
                  initialNumToRender={16}
                  renderItem={({ item: iconName }) => {
                    const Icon = ICON_MAP[iconName];
                    const isActive = selectedIcon === iconName;
                    return (
                      <TouchableOpacity 
                        style={[styles.gridIconButton, isActive && { backgroundColor: selectedColor }]}
                        onPress={() => {
                          setSelectedIcon(iconName);
                          setModalStep('main');
                        }}
                      >
                        <Icon color={isActive ? '#121212' : '#888'} size={24} />
                      </TouchableOpacity>
                    );
                  }}
                />
              </View>
            )}

          </View>
        </KeyboardAvoidingView>
      </Modal>

    </View>
  );
}