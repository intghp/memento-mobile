import { create } from 'zustand';
import { db } from '../database/db';
import { Task } from '../types';

interface TaskStore {
  tasks: Task[];
  fetchTasks: (date: string) => Promise<void>;
  addTask: (title: string, targetDate: string) => Promise<void>;
  toggleTask: (id: number, currentStatus: boolean) => Promise<void>;
  deleteCompletedTasks: (date: string) => Promise<void>;
}

export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: [],

  // Busca as tarefas de um dia específico
  fetchTasks: async (date) => {
    try {
      // getAllAsync pega vários registros e traz num Array
      const result = await db.getAllAsync<{ 
        id: number; title: string; target_date: string; is_completed: number; position: number 
      }>(
        'SELECT * FROM tasks WHERE target_date = ? ORDER BY position ASC, id ASC',
        [date]
      );

      const formattedTasks: Task[] = result.map(task => ({
        ...task,
        is_completed: task.is_completed === 1,
      }));

      set({ tasks: formattedTasks });
    } catch (error) {
      console.error('Erro ao buscar tarefas:', error);
    }
  },

  // Cria uma tarefa nova
  addTask: async (title, targetDate) => {
    try {
      // runAsync é para INSERT, UPDATE, DELETE
      await db.runAsync(
        'INSERT INTO tasks (title, target_date, is_completed, position) VALUES (?, ?, 0, 0)',
        [title, targetDate]
      );
      
      // Atualiza a lista na tela
      await get().fetchTasks(targetDate);
    } catch (error) {
      console.error('Erro ao adicionar tarefa:', error);
    }
  },

  // Marca como concluída ou desmarca
  toggleTask: async (id, currentStatus) => {
    try {
      const newStatus = currentStatus ? 0 : 1;
      await db.runAsync('UPDATE tasks SET is_completed = ? WHERE id = ?', [newStatus, id]);
      
      // Atualiza a lista na tela
      const currentTasks = get().tasks;
      if (currentTasks.length > 0) {
        await get().fetchTasks(currentTasks[0].target_date);
      }
    } catch (error) {
      console.error('Erro ao alternar tarefa:', error);
    }
  },

  // Remove apenas as concluídas do dia
  deleteCompletedTasks: async (date) => {
    try {
      await db.runAsync('DELETE FROM tasks WHERE target_date = ? AND is_completed = 1', [date]);
      await get().fetchTasks(date);
    } catch (error) {
      console.error('Erro ao deletar tarefas concluídas:', error);
    }
  }
}));