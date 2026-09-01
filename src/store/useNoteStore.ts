import { create } from 'zustand';
import { db } from '../database/db';

interface NoteStore {
  currentNote: string;
  fetchNote: (date: string) => Promise<void>;
  saveNote: (date: string, content: string) => Promise<void>;
}

export const useNoteStore = create<NoteStore>((set) => ({
  currentNote: '',

  fetchNote: async (date) => {
    if (!date) return;
    try {
      const result = await db.getFirstAsync<{ content: string }>(
        'SELECT content FROM notes WHERE date = ?',
        [date]
      );
      
      set({ currentNote: result ? result.content : '' });
    } catch (error) {
      console.error('Erro ao buscar nota:', error);
    }
  },

  saveNote: async (date, content) => {
    if (!date) return;
    try {
      const existingNote = await db.getFirstAsync<{ id: number }>(
        'SELECT id FROM notes WHERE date = ?',
        [date]
      );

      if (existingNote) {
        await db.runAsync('UPDATE notes SET content = ? WHERE date = ?', [content, date]);
      } else {
        await db.runAsync('INSERT INTO notes (date, content) VALUES (?, ?)', [date, content]);
      }
      
      set({ currentNote: content });
    } catch (error) {
      console.error('Erro ao salvar nota:', error);
    }
  }
}));