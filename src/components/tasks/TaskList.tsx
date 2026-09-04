import { CheckCircle2, Circle, Plus, Trash2 } from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Animated,
  FlatList,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { useDateStore } from '../../store/useDateStore';
import { useTaskStore } from '../../store/useTaskStore';
import { styles } from './styles';

export default function TasksList() {
  const { t } = useTranslation();
  
  // Conectando aos Stores
  const { selectedDate } = useDateStore();
  const { tasks, fetchTasks, addTask, toggleTask, deleteCompletedTasks } = useTaskStore();
  
  // Estado local apenas para o campo de digitação
  const [newTaskTitle, setNewTaskTitle] = useState('');
  
  const borderAnim = useRef(new Animated.Value(0)).current;

  // Toda vez que a data mudar, o app busca as tarefas daquele dia
  useEffect(() => {
    fetchTasks(selectedDate);
  }, [selectedDate, fetchTasks]);

  // Função para adicionar tarefa e limpar o campo
  const handleAddTask = () => {
    if (newTaskTitle.trim() === '') return;
    addTask(newTaskTitle, selectedDate);
    setNewTaskTitle('');
  };

  const handleFocus = () => {
    Animated.timing(borderAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const handleBlur = () => {
    Animated.timing(borderAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  return (
    // Limitando a área da aplicação
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#121212" />

      {/* CAMPO DE NOVA TAREFA */}
      <View style={[styles.inputContainer, { marginTop: 20 }]}>
        <View style={styles.formContainer}>
          <TextInput
            style={styles.animatedInput}
            placeholder={t('tasks.placeholder')}
            placeholderTextColor="#666"
            value={newTaskTitle}
            onChangeText={setNewTaskTitle}
            onSubmitEditing={handleAddTask}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
          <View style={styles.borderBase} />
          <Animated.View style={[styles.borderAnimated, { transform: [{ scaleX: borderAnim }] }]} />
        </View>
        <TouchableOpacity style={styles.addButton} onPress={handleAddTask}>
          <Plus color="#FFFFFF" size={28} />
        </TouchableOpacity>
      </View>

      {/* LISTA DE TAREFAS */}
      <FlatList
        style={{ flex: 1 }}
        data={tasks}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        ListEmptyComponent={
          <Text style={styles.emptyText}>{t('tasks.empty')}</Text>
        }
        renderItem={({ item }) => (
          <View style={[styles.taskCard, item.is_completed && { opacity: 0.6 }]}>
            <TouchableOpacity 
              style={styles.checkbox} 
              onPress={() => toggleTask(item.id, item.is_completed)}
            >
              {item.is_completed ? (
                <CheckCircle2 color="#FFFFFF" size={24} />
              ) : (
                <Circle color="#666" size={24} />
              )}
            </TouchableOpacity>
            
            <Text style={[
              styles.taskTitle, 
              item.is_completed && styles.taskTitleCompleted
            ]}>
              {item.title}
            </Text>
          </View>
        )}
      />

      {/* BOTÃO LIMPAR CONCLUÍDAS */}
      {tasks.some(t => t.is_completed) && (
        <TouchableOpacity 
          style={styles.clearButton} 
          onPress={() => deleteCompletedTasks(selectedDate)}
        >
          <Trash2 color="#888" size={20} />
          <Text style={styles.clearButtonText}>{t('tasks.clear_completed')}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}