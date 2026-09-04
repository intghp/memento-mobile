import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface SettingsState {
  notificationsEnabled: boolean;
  notificationTime: string; // Ex: "20:00"
  hapticsEnabled: boolean;
  theme: 'dark' | 'light' | 'system';
  language: string | null;
  
  // Ações
  setNotificationsEnabled: (value: boolean) => void;
  setNotificationTime: (time: string) => void;
  setHapticsEnabled: (value: boolean) => void;
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

      setNotificationsEnabled: (value) => set({ notificationsEnabled: value }),
      setNotificationTime: (time) => set({ notificationTime: time }),
      setHapticsEnabled: (value) => set({ hapticsEnabled: value }),
      setTheme: (value) => set({ theme: value }),
      setLanguage: (lang) => set({ language: lang }),
    }),
    {
      name: 'memento-settings-storage', // Nome do "arquivo" salvo no celular
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);