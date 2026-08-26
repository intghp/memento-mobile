import { create } from 'zustand';

// Formato padrão: "YYYY-MM-DD"
interface DateState {
  selectedDate: string;
  setSelectedDate: (date: string) => void;
}

// Inicializa com a data formatada
const getTodayString = () => new Date().toISOString().split('T')[0];

export const useDateStore = create<DateState>((set) => ({
  selectedDate: getTodayString(),
  setSelectedDate: (date) => set({ selectedDate: date }),
}));