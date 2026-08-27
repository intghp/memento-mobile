import * as SQLite from 'expo-sqlite';

// Cria ou abre o arquivo físico memento.db no armazenamento do celular
export const db = SQLite.openDatabaseSync('memento.db');

export const initDB = async () => {
  try {
    // execAsync para rodar múltiplos comandos de criação (DDL) de uma vez
    await db.execAsync(`
      PRAGMA journal_mode = WAL;
      PRAGMA foreign_keys = ON;

      -- 1. TABELA DE TAREFAS (TASKS)
      CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        target_date TEXT NOT NULL,
        is_completed INTEGER DEFAULT 0,
        position INTEGER DEFAULT 0
      );

      -- 2. TABELA DE NOTAS DIÁRIAS (DAILY NOTES)
      CREATE TABLE IF NOT EXISTS notes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        content TEXT DEFAULT '',
        target_date TEXT NOT NULL UNIQUE
      );

      -- 3. TABELA DE HÁBITOS (HABITS)
      CREATE TABLE IF NOT EXISTS habits (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        frequency TEXT NOT NULL,
        specific_days TEXT,
        shift TEXT,
        is_quantitative INTEGER DEFAULT 0,
        goal_amount REAL,
        unit TEXT,
        color TEXT DEFAULT '#00E676',
        icon TEXT DEFAULT 'Activity',
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      );

      -- 4. TABELA DE LOGS DOS HÁBITOS (HABIT LOGS)
      CREATE TABLE IF NOT EXISTS habit_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        habit_id INTEGER NOT NULL,
        target_date TEXT NOT NULL,
        is_completed INTEGER DEFAULT 0,
        is_skipped INTEGER DEFAULT 0,
        amount_completed REAL,
        FOREIGN KEY (habit_id) REFERENCES habits (id) ON DELETE CASCADE
      );
    `);

    // -- Migração --
    try { await db.execAsync(`ALTER TABLE habits ADD COLUMN color TEXT DEFAULT '#00E676';`); } catch (e) {}
    try { await db.execAsync(`ALTER TABLE habits ADD COLUMN icon TEXT DEFAULT 'Activity';`); } catch (e) {}
    
    console.log('✅ Banco de dados Memento inicializado com sucesso!');
  } catch (error) {
    console.error('❌ Erro ao inicializar o banco de dados:', error);
  }
};