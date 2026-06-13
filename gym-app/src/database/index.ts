import * as SQLite from "expo-sqlite";

let db: SQLite.SQLiteDatabase | null = null;

export async function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (db) return db;
  db = await SQLite.openDatabaseAsync("gym_workouts.db");
  await initializeDatabase(db);
  return db;
}

async function initializeDatabase(database: SQLite.SQLiteDatabase) {
  await database.execAsync(`
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS workouts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      focus TEXT NOT NULL,
      focus_label TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      completed_at TEXT,
      duration_seconds INTEGER,
      notes TEXT
    );

    CREATE TABLE IF NOT EXISTS exercises (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      workout_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      muscle_group TEXT NOT NULL,
      target_sets INTEGER NOT NULL,
      target_reps TEXT NOT NULL,
      rest_seconds INTEGER NOT NULL DEFAULT 60,
      order_index INTEGER NOT NULL,
      notes TEXT,
      FOREIGN KEY (workout_id) REFERENCES workouts(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS exercise_sets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      exercise_id INTEGER NOT NULL,
      set_number INTEGER NOT NULL,
      target_reps INTEGER NOT NULL,
      actual_reps INTEGER,
      weight_kg REAL,
      completed INTEGER NOT NULL DEFAULT 0,
      rest_seconds INTEGER NOT NULL DEFAULT 60,
      completed_at TEXT,
      FOREIGN KEY (exercise_id) REFERENCES exercises(id) ON DELETE CASCADE
    );
  `);
}
