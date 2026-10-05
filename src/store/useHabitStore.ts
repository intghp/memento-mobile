import { create } from 'zustand';
import { db } from '../database/db';
import { Habit, HabitLog } from '../types';

interface HabitStore {
  habits: Habit[];
  habitLogs: HabitLog[];
  isReorderMode: boolean;
  toggleReorderMode: () => void;
  fetchHabits: (date: string) => Promise<void>;
  fetchHabitLogs: (habitId: number) => Promise<void>;
  clearHabitLogs: () => void;
  addHabit: (habit: Omit<Habit, 'id' | 'log_id' | 'is_completed' | 'is_skipped' | 'amount_completed'>, currentDate: string) => Promise<void>;
  updateHabit: (habitId: number, habitData: Partial<Habit>, currentDate: string) => Promise<void>;
  toggleHabitStatus: (habitId: number, date: string, currentCompleted?: number, currentSkipped?: number) => Promise<void>;
  updateHabitProgress: (habitId: number, date: string, amountCompleted: number, goalAmount: number | null) => Promise<void>;
  deleteHabit: (habitId: number, currentDate: string) => Promise<void>;
  reorderHabits: (orderedHabits: Habit[]) => Promise<void>;
}

export const useHabitStore = create<HabitStore>((set, get) => ({
  habits: [],
  habitLogs: [],
  isReorderMode: false,

  toggleReorderMode: () => set((state) => ({ isReorderMode: !state.isReorderMode })),
  clearHabitLogs: () => set({ habitLogs: [] }),

  fetchHabits: async (date) => {
    if (!date) return;
    try {
      const [year, month, day] = date.split('-').map(Number);
      const dayOfWeek = new Date(year, month - 1, day).getDay();
      
      const result = await db.getAllAsync<Habit>(`
        SELECT h.*, l.id as log_id, l.is_completed, l.is_skipped, l.amount_completed 
        FROM habits h
        LEFT JOIN habit_logs l ON h.id = l.habit_id AND l.target_date = ?
        WHERE h.specific_days IS NULL OR h.specific_days LIKE ?
        ORDER BY h.position ASC, h.id ASC
      `, [date, `%${dayOfWeek}%`]);
      
      set({ habits: result });
    } catch (error) {
      console.error('Erro ao buscar hábitos:', error);
    }
  },

  fetchHabitLogs: async (habitId) => {
    try {
      const result = await db.getAllAsync<HabitLog>(
        'SELECT target_date, is_completed, is_skipped, amount_completed FROM habit_logs WHERE habit_id = ?',
        [habitId]
      );
      set({ habitLogs: result });
    } catch (error) {
      console.error('Erro ao buscar logs do hábito:', error);
    }
  },

  addHabit: async (habit, currentDate) => {
    try {
      await db.runAsync(`
        INSERT INTO habits (name, frequency, specific_days, is_quantitative, goal_amount, unit, color, icon, position)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0)
      `, [
        habit.name ?? 'Novo Hábito', 
        habit.frequency ?? 'Diário', 
        habit.specific_days ?? null, 
        habit.is_quantitative ? 1 : 0, 
        habit.goal_amount ?? null, 
        habit.unit ?? null,
        habit.color ?? '#00E676',
        habit.icon ?? 'Activity'
      ]);
      
      if (currentDate) await get().fetchHabits(currentDate);
    } catch (error) {
      console.error('Erro ao adicionar hábito:', error);
    }
  },

  updateHabit: async (habitId, habitData, currentDate) => {
    if (!habitId) return;
    try {
      await db.runAsync(`
        UPDATE habits 
        SET name = ?, color = ?, icon = ?, is_quantitative = ?, goal_amount = ?, unit = ?, specific_days = ?
        WHERE id = ?
      `, [
        habitData.name ?? 'Hábito',
        habitData.color ?? '#00E676',
        habitData.icon ?? 'Activity',
        habitData.is_quantitative ? 1 : 0,
        habitData.goal_amount ?? null,
        habitData.unit ?? null,
        habitData.specific_days ?? null,
        habitId
      ]);
      
      if (currentDate) await get().fetchHabits(currentDate);
    } catch (error) {
      console.error('Erro ao atualizar hábito:', error);
    }
  },

  toggleHabitStatus: async (habitId, date, currentCompleted = 0, currentSkipped = 0) => {
    if (!habitId || !date) return;
    try {
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
      
      const existingLog = await db.getFirstAsync('SELECT id FROM habit_logs WHERE habit_id = ? AND target_date = ?', [habitId, date]);
      
      if (existingLog) {
         await db.runAsync('UPDATE habit_logs SET is_completed = ?, is_skipped = ? WHERE habit_id = ? AND target_date = ?', [nextCompleted, nextSkipped, habitId, date]);
      } else {
         await db.runAsync('INSERT INTO habit_logs (habit_id, target_date, is_completed, is_skipped) VALUES (?, ?, ?, ?)', [habitId, date, nextCompleted, nextSkipped]);
      }
      
      await get().fetchHabits(date);
    } catch (error) {
      console.error('Erro ao alternar status do hábito:', error);
    }
  },

  updateHabitProgress: async (habitId, date, amountCompleted, goalAmount) => {
    if (!habitId || !date) return;
    try {
      const isCompleted = amountCompleted >= (goalAmount || 0) ? 1 : 0;
      const existingLog = await db.getFirstAsync('SELECT id FROM habit_logs WHERE habit_id = ? AND target_date = ?', [habitId, date]);
      
      if (existingLog) {
         await db.runAsync('UPDATE habit_logs SET amount_completed = ?, is_completed = ?, is_skipped = 0 WHERE habit_id = ? AND target_date = ?', [amountCompleted, isCompleted, habitId, date]);
      } else {
         await db.runAsync('INSERT INTO habit_logs (habit_id, target_date, is_completed, is_skipped, amount_completed) VALUES (?, ?, ?, 0, ?)', [habitId, date, isCompleted, amountCompleted]);
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
      if (currentDate) await get().fetchHabits(currentDate);
    } catch (error) {
      console.error('Erro ao deletar hábito:', error);
    }
  },

  reorderHabits: async (orderedHabits) => {
    set({ habits: orderedHabits }); 
    try {
      for (let i = 0; i < orderedHabits.length; i++) {
        await db.runAsync('UPDATE habits SET position = ? WHERE id = ?', [i, orderedHabits[i].id]);
      }
    } catch (error) {
      console.error('Erro ao reordenar hábitos:', error);
    }
  }
}));