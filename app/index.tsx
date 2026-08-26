import { CheckCircle2, Circle, Plus, Trash2 } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDateStore } from '../src/store/useDateStore';
import { useTaskStore } from '../src/store/useTaskStore';

export default function TasksScreen() {
  // Conectando aos Stores
  const { selectedDate } = useDateStore();
  const { tasks, fetchTasks, addTask, toggleTask, deleteCompletedTasks } = useTaskStore();
  
  // Estado local apenas para o campo de digitação
  const [newTaskTitle, setNewTaskTitle] = useState('');

  // Toda vez que a data mudar, o app busca as tarefas daquele dia
  useEffect(() => {
    fetchTasks(selectedDate);
  }, [selectedDate]);

  // Função para adicionar tarefa e limpar o campo
  const handleAddTask = () => {
    if (newTaskTitle.trim() === '') return;
    addTask(newTaskTitle, selectedDate);
    setNewTaskTitle('');
  };

  return (
    // Limitando a área da aplicação
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#121212" />

      {/* CABEÇALHO */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Memento</Text>
        <Text style={styles.dateText}>{selectedDate}</Text>
      </View>

      {/* CAMPO DE NOVA TAREFA */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Adicionar nova tarefa..."
          placeholderTextColor="#666"
          value={newTaskTitle}
          onChangeText={setNewTaskTitle}
          onSubmitEditing={handleAddTask}
        />
        <TouchableOpacity style={styles.addButton} onPress={handleAddTask}>
          <Plus color="#fff" size={24} />
        </TouchableOpacity>
      </View>

      {/* LISTA DE TAREFAS */}
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Nenhuma tarefa para este dia.</Text>
        }
        renderItem={({ item }) => (
          <View style={styles.taskCard}>
            <TouchableOpacity 
              style={styles.checkbox} 
              onPress={() => toggleTask(item.id, item.is_completed)}
            >
              {item.is_completed ? (
                <CheckCircle2 color="#888" size={24} />
              ) : (
                <Circle color="#fff" size={24} />
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
          <Text style={styles.clearButtonText}>Limpar concluídas</Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}

// ESTILIZAÇÃO
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  dateText: {
    fontSize: 16,
    color: '#888888',
  },
  inputContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  input: {
    flex: 1,
    height: 50,
    backgroundColor: '#1E1E1E',
    borderRadius: 8,
    paddingHorizontal: 16,
    color: '#ffffff',
    fontSize: 16,
  },
  addButton: {
    width: 50,
    height: 50,
    backgroundColor: '#333333',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  listContainer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  taskCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  checkbox: {
    marginRight: 12,
  },
  taskTitle: {
    fontSize: 16,
    color: '#ffffff',
    flex: 1,
  },
  taskTitleCompleted: {
    color: '#666666',
    textDecorationLine: 'line-through',
  },
  emptyText: {
    color: '#555555',
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
  },
  clearButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#1E1E1E',
  },
  clearButtonText: {
    color: '#888888',
    marginLeft: 8,
    fontSize: 16,
  },
});