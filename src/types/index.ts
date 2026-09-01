export interface Task {
  id: number;
  title: string;
  target_date: string;
  is_completed: boolean;
  position: number;
}

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

export interface HabitLog {
  target_date: string;
  is_completed: number;
  is_skipped: number;
  amount_completed: number | null;
}

export interface Note {
  id: number;
  date: string;
  content: string;
}