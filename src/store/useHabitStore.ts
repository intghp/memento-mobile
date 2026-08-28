import { create } from 'zustand';
import { db } from '../database/db';

export interface Habit {
  id: number;
  name: string;
  frequency: string;
  specific_days: string | null;
  shift: string; // 'Manhã', 'Tarde', 'Noite'
  is_quantitative: number | boolean;
  goal_amount: number | null;
  unit: string | null;
  color: string;
  icon: string;
  // Os campos abaixo vêm da tabela de Logs (específicos do dia selecionado)
  log_id?: number;
  is_completed?: number;
  is_skipped?: number;
  amount_completed?: number;
}

interface HabitStore {
  habits: Habit[];
  fetchHabits: (date: string) => Promise<void>;
  addHabit: (habit: Omit<Habit, 'id' | 'log_id' | 'is_completed' | 'is_skipped' | 'amount_completed'>, currentDate: string) => Promise<void>;
  updateHabit: (habitId: number, habitData: Partial<Habit>, currentDate: string) => Promise<void>;
  toggleHabitStatus: (habitId: number, date: string, currentCompleted?: number, currentSkipped?: number) => Promise<void>;
  updateHabitProgress: (habitId: number, date: string, amountCompleted: number, goalAmount: number | null) => Promise<void>;
  deleteHabit: (habitId: number, currentDate: string) => Promise<void>;
}

export const useHabitStore = create<HabitStore>((set, get) => ({
  habits: [],

  // Busca todos os hábitos e cruza com os Logs do dia selecionado
  fetchHabits: async (date) => {
    if (!date) return;
    try {
      // Utiliza um LEFT JOIN: Pega todos os hábitos e, SE houver um log para hoje, traz junto.
      const result = await db.getAllAsync<Habit>(`
        SELECT 
          h.*, 
          l.id as log_id, 
          l.is_completed, 
          l.is_skipped, 
          l.amount_completed 
        FROM habits h
        LEFT JOIN habit_logs l ON h.id = l.habit_id AND l.target_date = ?
      `, [date]);
      
      set({ habits: result });
    } catch (error) {
      console.error('Erro ao buscar hábitos:', error);
    }
  },

  // Adiciona um novo hábito mestre no banco
  addHabit: async (habit, currentDate) => {
    try {
      await db.runAsync(`
        INSERT INTO habits (name, frequency, specific_days, shift, is_quantitative, goal_amount, unit, color, icon)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        habit.name ?? 'Novo Hábito', 
        habit.frequency ?? 'Diário', 
        habit.specific_days ?? null, 
        habit.shift ?? 'Qualquer', 
        habit.is_quantitative ? 1 : 0, 
        habit.goal_amount ?? null, 
        habit.unit ?? null,
        habit.color ?? '#00E676',
        habit.icon ?? 'Activity'
      ]);
      
      if (currentDate) {
        await get().fetchHabits(currentDate);
      }
    } catch (error) {
      console.error('Erro ao adicionar hábito:', error);
    }
  },

  updateHabit: async (habitId, habitData, currentDate) => {
    if (!habitId) return;
    try {
      await db.runAsync(`
        UPDATE habits 
        SET name = ?, shift = ?, color = ?, icon = ?, is_quantitative = ?, goal_amount = ?, unit = ?
        WHERE id = ?
      `, [
        habitData.name ?? 'Hábito',
        habitData.shift ?? 'Qualquer',
        habitData.color ?? '#00E676',
        habitData.icon ?? 'Activity',
        habitData.is_quantitative ? 1 : 0,
        habitData.goal_amount ?? null,
        habitData.unit ?? null,
        habitId
      ]);
      
      if (currentDate) {
        await get().fetchHabits(currentDate);
      }
    } catch (error) {
      console.error('Erro ao atualizar hábito:', error);
    }
  },

  // Marca/Desmarca o hábito no dia específico
  toggleHabitStatus: async (habitId, date, currentCompleted = 0, currentSkipped = 0) => {
    if (!habitId || !date) return;
    try {
      // Inverte o status atual (O ciclo: Pendente -> Concluído -> Isento -> Falha -> Pendente)
      let nextCompleted = 0;
      let nextSkipped = 0;

      if (currentCompleted === 1) {
        nextCompleted = 0;
        nextSkipped = 1;
      } else if (currentSkipped === 1) {
        nextCompleted = -1;
        nextSkipped = 0;
      } else if (currentCompleted === -1) {
        nextCompleted = 0;
        nextSkipped = 0;
      } else {
        nextCompleted = 1;
        nextSkipped = 0;
      }
      
      // Verifica se já existe um registro (Log) para este hábito neste dia
      const existingLog = await db.getFirstAsync(
        'SELECT id FROM habit_logs WHERE habit_id = ? AND target_date = ?', 
        [habitId, date]
      );
      
      if (existingLog) {
         // Atualiza o log existente
         await db.runAsync(
           'UPDATE habit_logs SET is_completed = ?, is_skipped = ? WHERE habit_id = ? AND target_date = ?', 
           [nextCompleted, nextSkipped, habitId, date]
         );
      } else {
         // Cria um log novo para este dia
         await db.runAsync(
           'INSERT INTO habit_logs (habit_id, target_date, is_completed, is_skipped) VALUES (?, ?, ?, ?)', 
           [habitId, date, nextCompleted, nextSkipped]
         );
      }
      
      // Recarrega a lista para atualizar a bolinha na tela imediatamente
      await get().fetchHabits(date);
    } catch (error) {
      console.error('Erro ao alternar status do hábito:', error);
    }
  },

  updateHabitProgress: async (habitId, date, amountCompleted, goalAmount) => {
    if (!habitId || !date) return;
    try {
      const isCompleted = amountCompleted >= (goalAmount || 0) ? 1 : 0;
      const existingLog = await db.getFirstAsync(
        'SELECT id FROM habit_logs WHERE habit_id = ? AND target_date = ?', 
        [habitId, date]
      );
      
      if (existingLog) {
         await db.runAsync(
           'UPDATE habit_logs SET amount_completed = ?, is_completed = ?, is_skipped = 0 WHERE habit_id = ? AND target_date = ?', 
           [amountCompleted, isCompleted, habitId, date]
         );
      } else {
         await db.runAsync(
           'INSERT INTO habit_logs (habit_id, target_date, is_completed, is_skipped, amount_completed) VALUES (?, ?, ?, 0, ?)', 
           [habitId, date, isCompleted, amountCompleted]
         );
      }
      
      await get().fetchHabits(date);
    } catch (error) {
      console.error('Erro ao atualizar progresso do hábito:', error);
    }
  },

  deleteHabit: async (habitId, currentDate) => {
    if (!habitId) return;
    try {
      await db.runAsync('DELETE FROM habits WHERE id = ?', [habitId]);
      if (currentDate) {
        await get().fetchHabits(currentDate);
      }
    } catch (error) {
      console.error('Erro ao deletar hábito:', error);
    }
  }
}));