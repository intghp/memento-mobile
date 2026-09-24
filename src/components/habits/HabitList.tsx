import { format } from 'date-fns';
import { Activity, AlertTriangle, Apple, ArrowLeft, ArrowUpDown, Baby, Bed, Bike, Book, BookOpen, Brain, Briefcase, Camera, Car, Check, ChevronDown, ChevronUp, Circle, Clock, Cloud, Code, Coffee, Compass, Cpu, CreditCard, Crosshair, Droplets, Dumbbell, Feather, Flag, Flame, Gamepad2, Gift, GraduationCap, Guitar, Headphones, Heart, Home, Image, Key, Leaf, Map, Mic, Minus, Monitor, Moon, Music, Palette, PenTool, Pill, Plane, Plus, Scissors, Shield, ShoppingBag, Smartphone, Smile, Speaker, Star, Sun, Target, Thermometer, Trash, Trash2, Trophy, Truck, Tv, Umbrella, Utensils, Video, Watch, Wifi, Wind, X, XCircle } from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Animated, KeyboardAvoidingView, Modal, Platform, ScrollView, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
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
  const { t } = useTranslation();
  const { selectedDate } = useDateStore();
  const { habits, fetchHabits, fetchHabitLogs, clearHabitLogs, addHabit, updateHabit, toggleHabitStatus, updateHabitProgress, deleteHabit, reorderHabits, isReorderMode, toggleReorderMode } = useHabitStore();

  // Estados do Modal de Adicionar Hábito
  const [isModalVisible, setModalVisible] = useState(false);
  const [modalStep, setModalStep] = useState<'main' | 'color' | 'icon'>('main');
  const [editingHabitId, setEditingHabitId] = useState<number | null>(null);
  
  const [newHabitName, setNewHabitName] = useState('');
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
  const isFirstRender = useRef(true);

  const todayDateString = format(new Date(), 'yyyy-MM-dd');
  const isPastDay = selectedDate < todayDateString;
  
  const daysList = t('habit_modal.days', { returnObjects: true });
  const daysArray = Array.isArray(daysList) ? daysList : ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

  // 1. Sempre que a data (Calendário) mudar, busca os hábitos atualizados
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

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

  const resetModal = () => {
    setNewHabitName('');
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
        color: selectedColor,
        icon: selectedIcon,
        is_quantitative: isQuantitative,
        goal_amount: goalNum,
        unit: isQuantitative ? unit : null,
        specific_days: daysString,
        shift: 'Qualquer'
      } as any, selectedDate);
    } else {
      await addHabit({
        name: newHabitName,
        frequency: 'Diário',
        specific_days: daysString,
        shift: 'Qualquer',
        is_quantitative: isQuantitative,
        goal_amount: goalNum,
        unit: isQuantitative ? unit : null,
        color: selectedColor,
        icon: selectedIcon
      } as any, selectedDate);
    }

    resetModal();
  };

  const executeDelete = () => {
    if (editingHabitId) {
      deleteHabit(editingHabitId, selectedDate);
      resetModal();
    }
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    const newHabits = [...habits];
    const temp = newHabits[index];
    newHabits[index] = newHabits[index - 1];
    newHabits[index - 1] = temp;
    reorderHabits(newHabits);
  };

  const moveDown = (index: number) => {
    if (index === habits.length - 1) return;
    const newHabits = [...habits];
    const temp = newHabits[index];
    newHabits[index] = newHabits[index + 1];
    newHabits[index + 1] = temp;
    reorderHabits(newHabits);
  };

  const SelectedIconComponent = ICON_MAP[selectedIcon] || Activity;

  return (
    <View style={styles.container}>
      
      <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
        {/* LISTA DE HÁBITOS Pura e Estável */}
        <ScrollView contentContainerStyle={[styles.listContent, { paddingTop: 24 }]} showsVerticalScrollIndicator={false}>
          
          <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', paddingHorizontal: 24, paddingBottom: 16 }}>
            <TouchableOpacity 
              onPress={toggleReorderMode} 
              style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 6, paddingHorizontal: 12, backgroundColor: isReorderMode ? 'rgba(0, 230, 118, 0.15)' : '#1A1A1A', borderRadius: 20 }}
            >
              <ArrowUpDown color={isReorderMode ? '#00E676' : '#888'} size={16} />
              <Text style={{ color: isReorderMode ? '#00E676' : '#888', fontSize: 13, fontWeight: 'bold', marginLeft: 8 }}>
                {isReorderMode ? "Concluído" : "Reordenar"}
              </Text>
            </TouchableOpacity>
          </View>

          {habits.length === 0 ? (
            <View style={styles.emptyContainer}>
               <Text style={styles.emptyText}>{t('habit_list.empty_title')}</Text>
               <Text style={styles.emptySubText}>{t('habit_list.empty_subtitle')}</Text>
            </View>
          ) : (
            habits.map((item, index) => {
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
                <View key={item.id} style={styles.habitRow}>             
                  
                  {/* Esquerda: Ícone Genérico e Nome */}
                  <TouchableOpacity 
                    activeOpacity={isReorderMode ? 1 : 0.7} 
                    style={styles.leftContent}
                    onPress={async () => {
                      if (!isReorderMode) {
                        clearHabitLogs();             
                        await fetchHabitLogs(item.id);
                        setHeatmapHabit(item);
                      }
                    }} 
                    onLongPress={() => {
                      if (!isReorderMode) openEditModal(item);
                    }}
                  >
                    <View style={[styles.iconWrapper, { borderColor: isColored ? item.color : '#333' }]}>
                      <IconComponent color={isColored ? item.color : '#555'} size={16} />
                    </View>
                    <Text style={[styles.habitName, isFaded && styles.habitNameFaded]}>
                      {item.name}
                    </Text>
                  </TouchableOpacity>

                  {/* Direita: Check ou Controles de Ordem */}
                  {!isReorderMode ? (
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
                  ) : (
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', width: 80, gap: 8 }}>
                      <TouchableOpacity onPress={() => moveUp(index)} disabled={index === 0} style={{ padding: 8 }}>
                        <ChevronUp color={index === 0 ? '#333' : '#ffffff'} size={24} />
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => moveDown(index)} disabled={index === habits.length - 1} style={{ padding: 8 }}>
                        <ChevronDown color={index === habits.length - 1 ? '#333' : '#ffffff'} size={24} />
                      </TouchableOpacity>
                    </View>
                  )}
                  
                </View>
              );
            })
          )}
        </ScrollView>
      </Animated.View>

      {/* BOTÃO FLUTUANTE DE ADICIONAR */}
      {!isReorderMode && (
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
      )}

      <HabitMacroVision 
        habit={heatmapHabit} 
        onClose={() => setHeatmapHabit(null)} 
        onEdit={() => {
          if (heatmapHabit) {
            const habitToEdit = heatmapHabit;
            setHeatmapHabit(null);
            setTimeout(() => {
              openEditModal(habitToEdit);
            }, 150);
          }
        }}
      />

      <Modal visible={!!progressHabit} transparent={true} animationType="fade" onRequestClose={() => setProgressHabit(null)}>
        <KeyboardAvoidingView style={styles.progressModalOverlay} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <View style={styles.progressModalContent}>
            <Text style={styles.progressModalTitle}>{t('progress_modal.title')}</Text>
            <Text style={styles.progressModalSub}>
              {t('progress_modal.goal')} {progressHabit?.goal_amount} {progressHabit?.unit}
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
                <Text style={styles.progressCancelText}>{t('progress_modal.cancel')}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.progressSaveBtn, { backgroundColor: progressHabit?.color || '#ffffff' }]} onPress={() => {
                if (!progressHabit) return;
                
                const amount = parseFloat(progressInput.replace(',', '.')) || 0;
                updateHabitProgress(progressHabit.id, selectedDate, amount, progressHabit.goal_amount);
                setProgressHabit(null);
              }}>
                <Text style={styles.progressSaveText}>{t('progress_modal.save')}</Text>
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
                <Text style={styles.deleteModalTitle}>{t('delete_modal.title')}</Text>
                <Text style={styles.deleteModalText}>{t('delete_modal.warning')}</Text>
              </View>
            </View>
            <View style={styles.deleteModalDivider} />
            <View style={styles.deleteModalButtons}>
              <TouchableOpacity style={styles.deleteCancelButton} onPress={() => setShowDeleteConfirm(false)}>
                <Text style={styles.deleteCancelText}>{t('delete_modal.cancel')}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.deleteConfirmButton} onPress={executeDelete}>
                <Text style={styles.deleteConfirmText}>{t('delete_modal.confirm')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* MODAL PRINCIPAL E SUBTELAS */}
      <Modal visible={isModalVisible} transparent={true} animationType="slide" onRequestClose={resetModal}>
        <KeyboardAvoidingView 
          style={styles.fullScreenModalOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <SafeAreaView style={styles.fullScreenModalContent}>
            
            {modalStep === 'main' && (
              <View style={{ flex: 1 }}>
                <View style={styles.fullScreenHeader}>
                  <TouchableOpacity onPress={resetModal} style={styles.headerIconButton}>
                    <ArrowLeft color="#fff" size={24} />
                  </TouchableOpacity>
                  <Text style={styles.fullScreenTitle}>{editingHabitId ? t('habit_modal.edit_habit') : t('habit_modal.new_habit')}</Text>
                  <TouchableOpacity onPress={handleSaveHabit} style={styles.headerTextButton}>
                    <Text style={styles.headerSaveText}>{t('habit_modal.save')}</Text>
                  </TouchableOpacity>
                </View>

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.fullScreenScrollContent}>
                  
                  <View style={styles.formRow}>
                    <View style={styles.inputGroupFlexible}>
                      <Text style={styles.label}>{t('habit_modal.name')}</Text>
                      <View style={styles.nameInputContainer}>
                        <TouchableOpacity style={styles.nameIconSelector} onPress={() => setModalStep('icon')}>
                          <SelectedIconComponent color={selectedColor} size={20} />
                        </TouchableOpacity>
                        <TextInput
                          style={styles.nameInput}
                          placeholder={t('habit_modal.name_placeholder')}
                          placeholderTextColor="#666"
                          value={newHabitName}
                          onChangeText={setNewHabitName}
                        />
                      </View>
                    </View>
                    
                    <View style={styles.inputGroupFixed}>
                      <Text style={styles.label}>{t('habit_modal.color')}</Text>
                      <TouchableOpacity 
                        style={[styles.colorBox, { backgroundColor: selectedColor }]} 
                        onPress={() => setModalStep('color')}
                      />
                    </View>
                  </View>

                  <View style={styles.switchRow}>
                    <Text style={styles.labelSwitch}>{t('habit_modal.quantitative')}</Text>
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
                        <Text style={styles.label}>{t('habit_modal.goal')}</Text>
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
                        <Text style={styles.label}>{t('habit_modal.unit')}</Text>
                        <View style={styles.pillInputContainer}>
                          <TextInput
                            style={styles.pillInput}
                            placeholder={t('habit_modal.unit_placeholder')}
                            placeholderTextColor="#666"
                            value={unit}
                            onChangeText={setUnit}
                          />
                        </View>
                      </View>
                    </View>
                  )}

                  <View style={styles.frequencyHeader}>
                    <Text style={styles.label}>{t('habit_modal.frequency')}</Text>
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
                        {isEveryday ? t('habit_modal.everyday') : t('habit_modal.specific_days')}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  
                  <View style={styles.minimalDaysRow}>
                    {daysArray.map((day, index) => {
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

                  {editingHabitId && (
                    <TouchableOpacity style={styles.deleteHabitButton} onPress={() => setShowDeleteConfirm(true)}>
                      <Trash2 color="#FF5252" size={20} />
                      <Text style={styles.deleteHabitText}>{t('habit_modal.delete')}</Text>
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
                  <Text style={styles.fullScreenTitle}>{t('habit_modal.color_title')}</Text>
                  <View style={{ width: 60 }} /> 
                </View>
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.fullScreenScrollContent}>
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 16 }}>
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
                  <Text style={styles.fullScreenTitle}>{t('habit_modal.icon_title')}</Text>
                  <View style={{ width: 60 }} /> 
                </View>
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.fullScreenScrollContent}>
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 16 }}>
                    {Object.keys(ICON_MAP).map((iconName) => {
                      const Icon = ICON_MAP[iconName];
                      const isActive = selectedIcon === iconName;
                      return (
                        <TouchableOpacity 
                          key={iconName}
                          style={[styles.gridIconButton, isActive && { backgroundColor: selectedColor }]}
                          onPress={() => {
                            setSelectedIcon(iconName);
                            setModalStep('main');
                          }}
                        >
                          <Icon color={isActive ? '#121212' : '#888'} size={24} />
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </ScrollView>
              </View>
            )}

          </SafeAreaView>
        </KeyboardAvoidingView>
      </Modal>

    </View>
  );
}