import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface SettingsState {
  theme: 'dark' | 'light' | 'system';
  language: string | null;
  
  // Ações
  setTheme: (theme: 'dark' | 'light' | 'system') => void;
  setLanguage: (lang: string) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      notificationsEnabled: true,
      notificationTime: '20:00',
      hapticsEnabled: true,
      theme: 'dark',
      language: null,

      setTheme: (value) => set({ theme: value }),
      setLanguage: (lang) => set({ language: lang }),
    }),
    {
      name: 'memento-settings-storage', // Nome do "arquivo" salvo no celular
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);