import { eachDayOfInterval, endOfWeek, format, startOfWeek, subWeeks } from 'date-fns';
import * as Icons from 'lucide-react-native';
import { Activity, ArrowLeft } from 'lucide-react-native';
import React, { useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';

import { useHabitStore } from '../../../store/useHabitStore';
import { Habit, HabitLog } from '../../../types';
import { styles } from './styles';

interface HabitMacroVisionProps {
  habit: Habit | null;
  onClose: () => void;
}

export function HabitMacroVision({ habit, onClose }: HabitMacroVisionProps) {
  const { t } = useTranslation();
  
  const monthsArray = t('heatmap.months', { returnObjects: true });
  const LOCAL_MONTHS = Array.isArray(monthsArray) ? monthsArray : ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  
  const daysArray = t('heatmap.days', { returnObjects: true });
  const LOCAL_DAYS = Array.isArray(daysArray) ? daysArray : ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];

  const habitLogs = useHabitStore((state) => state.habitLogs);
  
  const heatmapScrollRef = useRef<any>(null);
  const todayDateString = format(new Date(), 'yyyy-MM-dd');

  const logsDict = useMemo(() => {
    const dict: Record<string, HabitLog> = {};
    if (habitLogs && Array.isArray(habitLogs)) {
      habitLogs.forEach((log) => {
        dict[log.target_date] = log;
      });
    }
    return dict;
  }, [habitLogs]);

  const weeksData = useMemo(() => {
    if (!habit) return [];
    const today = new Date();
    const start = startOfWeek(subWeeks(today, 15), { weekStartsOn: 1 });
    const end = endOfWeek(today, { weekStartsOn: 1 });
    const days = eachDayOfInterval({ start, end });

    const weeks = [];
    for(let i = 0; i < days.length; i += 7) {
      weeks.push(days.slice(i, i + 7));
    }
    return weeks;
  }, [habit]);

  const IconComponent = habit?.icon ? (Icons as any)[habit.icon] : Activity;

  return (
    <Modal visible={!!habit} transparent={true} animationType="fade" onRequestClose={onClose}>
      <View style={styles.heatmapModalOverlay}>
        <View style={styles.heatmapModalContent}>
          
          <View style={styles.heatmapHeader}>
            <TouchableOpacity onPress={onClose} style={styles.heatmapCloseBtn}>
              <ArrowLeft color="#fff" size={24} />
            </TouchableOpacity>
            <View style={styles.heatmapTitleWrap}>
              {habit && <IconComponent color={habit.color} size={20} />}
              <Text style={styles.heatmapTitle}>{habit?.name}</Text>
            </View>
            <View style={{ width: 40 }} />
          </View>

          <View style={styles.heatmapWrapper}>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false} 
              ref={heatmapScrollRef} 
              onContentSizeChange={() => heatmapScrollRef.current?.scrollToEnd({ animated: false })} 
            >
              <View>
                <View style={styles.monthsRow}>
                  {weeksData.map((week, i) => {
                    const day = week[0];
                    const showMonth = day.getDate() <= 7 || i === 0;
                    return (
                      <View key={i} style={styles.monthLabelContainer}>
                        {showMonth && <Text style={styles.monthLabel}>{LOCAL_MONTHS[day.getMonth()]}</Text>}
                      </View>
                    );
                  })}
                </View>

                <View style={styles.gridRow}>
                  {weeksData.map((week, wIndex) => (
                    <View key={wIndex} style={styles.heatmapColumn}>
                      {week.map((day) => {
                        const dateStr = format(day, 'yyyy-MM-dd');
                        const log = logsDict[dateStr];
                        const isFuture = dateStr > todayDateString;
                        const dayOfWeek = day.getDay();
                        const isActiveDay = !habit?.specific_days || habit.specific_days.includes(dayOfWeek.toString());

                        let bgColor = '#1E1E1E';
                        let textColor = '#444';
                        let borderColor = 'transparent';
                        let progressPercent = 0;
                        let showProgressBar = false;

                        if (log) {
                          if (log.is_completed === 1) { 
                            bgColor = habit!.color;
                            textColor = '#121212';
                          } else if (log.is_skipped === 1) { 
                            bgColor = '#2A2A2A';
                            borderColor = habit!.color;
                            textColor = habit!.color;
                          } else if (log.is_completed === -1) { 
                            bgColor = '#4A0000';
                            textColor = '#FF8A80';
                          } else if (habit!.is_quantitative && log.amount_completed! > 0) {
                            bgColor = '#2A2A2A';
                            textColor = '#ffffff';
                            progressPercent = Math.min(100, (log.amount_completed! / habit!.goal_amount!) * 100);
                            showProgressBar = true;
                          } else if (dateStr < todayDateString) { 
                            bgColor = '#2A2A2A';
                            textColor = '#666';
                          }
                        } else if (!isFuture) {
                          if (isActiveDay) { 
                            bgColor = '#2A2A2A';
                            textColor = '#666';
                          } else { 
                            bgColor = '#1A1A1A';
                            textColor = '#333';
                          }
                        }

                        if (isFuture) {
                          bgColor = '#121212';
                          textColor = '#333';
                        }

                        return (
                          <View key={dateStr} style={[styles.heatmapSquare, { backgroundColor: bgColor, borderColor, borderWidth: borderColor !== 'transparent' ? 1 : 0, overflow: 'hidden', position: 'relative' }]}>
                            <Text style={[styles.heatmapSquareText, { color: textColor, zIndex: 1 }]}>{format(day, 'd')}</Text>
                            {showProgressBar && (
                              <View style={{ position: 'absolute', bottom: 0, left: 0, height: 4, width: '100%', backgroundColor: '#1A1A1A' }}>
                                <View style={{ height: '100%', width: `${progressPercent}%`, backgroundColor: habit!.color }} />
                              </View>
                            )}
                          </View>
                        );
                      })}
                    </View>
                  ))}
                </View>
              </View>
            </ScrollView>
            
            <View style={styles.heatmapDayLabels}>
              {LOCAL_DAYS.map((d, i) => (
                <Text key={i} style={styles.heatmapDayLabelText}>{d}</Text>
              ))}
            </View>
          </View>

        </View>
      </View>
    </Modal>
  );
}