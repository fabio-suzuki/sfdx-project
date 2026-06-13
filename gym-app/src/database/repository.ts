import { getDatabase } from "./index";
import type {
  Workout,
  Exercise,
  ExerciseSet,
  WorkoutWithExercises,
  ExerciseWithSets,
  PerformanceRecord,
  WorkoutFocus,
} from "../types";

// --- Workouts ---

export async function createWorkout(workout: Omit<Workout, "id" | "createdAt">): Promise<number> {
  const db = await getDatabase();
  const result = await db.runAsync(
    "INSERT INTO workouts (name, focus, focus_label, notes) VALUES (?, ?, ?, ?)",
    workout.name,
    workout.focus,
    workout.focusLabel,
    workout.notes ?? null
  );
  return result.lastInsertRowId;
}

export async function completeWorkout(workoutId: number, durationSeconds: number): Promise<void> {
  const db = await getDatabase();
  await db.runAsync(
    "UPDATE workouts SET completed_at = datetime('now'), duration_seconds = ? WHERE id = ?",
    durationSeconds,
    workoutId
  );
}

export async function getWorkout(workoutId: number): Promise<Workout | null> {
  const db = await getDatabase();
  const row = await db.getFirstAsync<{
    id: number;
    name: string;
    focus: string;
    focus_label: string;
    created_at: string;
    completed_at: string | null;
    duration_seconds: number | null;
    notes: string | null;
  }>("SELECT * FROM workouts WHERE id = ?", workoutId);
  if (!row) return null;
  return mapWorkoutRow(row);
}

export async function getWorkoutWithExercises(workoutId: number): Promise<WorkoutWithExercises | null> {
  const workout = await getWorkout(workoutId);
  if (!workout) return null;
  const exercises = await getExercisesForWorkout(workoutId);
  const exercisesWithSets: ExerciseWithSets[] = [];
  for (const exercise of exercises) {
    const sets = await getSetsForExercise(exercise.id!);
    exercisesWithSets.push({ ...exercise, completedSets: sets });
  }
  return { ...workout, exercises: exercisesWithSets };
}

export async function getAllWorkouts(): Promise<Workout[]> {
  const db = await getDatabase();
  const rows = await db.getAllAsync<{
    id: number;
    name: string;
    focus: string;
    focus_label: string;
    created_at: string;
    completed_at: string | null;
    duration_seconds: number | null;
    notes: string | null;
  }>("SELECT * FROM workouts ORDER BY created_at DESC");
  return rows.map(mapWorkoutRow);
}

export async function deleteWorkout(workoutId: number): Promise<void> {
  const db = await getDatabase();
  await db.runAsync("DELETE FROM workouts WHERE id = ?", workoutId);
}

// --- Exercises ---

export async function createExercise(exercise: Omit<Exercise, "id">): Promise<number> {
  const db = await getDatabase();
  const result = await db.runAsync(
    "INSERT INTO exercises (workout_id, name, muscle_group, target_sets, target_reps, rest_seconds, order_index, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
    exercise.workoutId,
    exercise.name,
    exercise.muscleGroup,
    exercise.sets,
    exercise.reps,
    exercise.restSeconds,
    exercise.orderIndex,
    exercise.notes ?? null
  );
  return result.lastInsertRowId;
}

export async function getExercisesForWorkout(workoutId: number): Promise<Exercise[]> {
  const db = await getDatabase();
  const rows = await db.getAllAsync<{
    id: number;
    workout_id: number;
    name: string;
    muscle_group: string;
    target_sets: number;
    target_reps: string;
    rest_seconds: number;
    order_index: number;
    notes: string | null;
  }>("SELECT * FROM exercises WHERE workout_id = ? ORDER BY order_index", workoutId);
  return rows.map(mapExerciseRow);
}

// --- Sets ---

export async function createExerciseSet(set: Omit<ExerciseSet, "id">): Promise<number> {
  const db = await getDatabase();
  const result = await db.runAsync(
    "INSERT INTO exercise_sets (exercise_id, set_number, target_reps, actual_reps, weight_kg, completed, rest_seconds, completed_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
    set.exerciseId,
    set.setNumber,
    set.targetReps,
    set.actualReps ?? null,
    set.weightKg ?? null,
    set.completed ? 1 : 0,
    set.restSeconds,
    set.completedAt ?? null
  );
  return result.lastInsertRowId;
}

export async function updateExerciseSet(
  setId: number,
  updates: { actualReps?: number; weightKg?: number; completed?: boolean }
): Promise<void> {
  const db = await getDatabase();
  const parts: string[] = [];
  const values: (number | string | null)[] = [];

  if (updates.actualReps !== undefined) {
    parts.push("actual_reps = ?");
    values.push(updates.actualReps);
  }
  if (updates.weightKg !== undefined) {
    parts.push("weight_kg = ?");
    values.push(updates.weightKg);
  }
  if (updates.completed !== undefined) {
    parts.push("completed = ?");
    values.push(updates.completed ? 1 : 0);
    if (updates.completed) {
      parts.push("completed_at = datetime('now')");
    }
  }

  if (parts.length === 0) return;
  values.push(setId);
  await db.runAsync(`UPDATE exercise_sets SET ${parts.join(", ")} WHERE id = ?`, ...values);
}

export async function getSetsForExercise(exerciseId: number): Promise<ExerciseSet[]> {
  const db = await getDatabase();
  const rows = await db.getAllAsync<{
    id: number;
    exercise_id: number;
    set_number: number;
    target_reps: number;
    actual_reps: number | null;
    weight_kg: number | null;
    completed: number;
    rest_seconds: number;
    completed_at: string | null;
  }>("SELECT * FROM exercise_sets WHERE exercise_id = ? ORDER BY set_number", exerciseId);
  return rows.map(mapSetRow);
}

// --- Performance ---

export async function getPerformanceHistory(limit: number = 30): Promise<PerformanceRecord[]> {
  const db = await getDatabase();
  const rows = await db.getAllAsync<{
    id: number;
    created_at: string;
    focus: string;
    focus_label: string;
    duration_seconds: number | null;
    total_volume: number;
    total_sets: number;
  }>(
    `SELECT
      w.id,
      w.created_at,
      w.focus,
      w.focus_label,
      w.duration_seconds,
      COALESCE(SUM(es.actual_reps * es.weight_kg), 0) as total_volume,
      COALESCE(SUM(CASE WHEN es.completed = 1 THEN 1 ELSE 0 END), 0) as total_sets
    FROM workouts w
    LEFT JOIN exercises e ON e.workout_id = w.id
    LEFT JOIN exercise_sets es ON es.exercise_id = e.id
    WHERE w.completed_at IS NOT NULL
    GROUP BY w.id
    ORDER BY w.created_at DESC
    LIMIT ?`,
    limit
  );

  return rows.map((row) => ({
    date: row.created_at,
    focus: row.focus as WorkoutFocus,
    focusLabel: row.focus_label,
    totalVolume: row.total_volume ?? 0,
    totalSets: row.total_sets ?? 0,
    durationMinutes: row.duration_seconds ? Math.round(row.duration_seconds / 60) : 0,
  }));
}

// --- Mappers ---

function mapWorkoutRow(row: {
  id: number;
  name: string;
  focus: string;
  focus_label: string;
  created_at: string;
  completed_at: string | null;
  duration_seconds: number | null;
  notes: string | null;
}): Workout {
  return {
    id: row.id,
    name: row.name,
    focus: row.focus as WorkoutFocus,
    focusLabel: row.focus_label,
    createdAt: row.created_at,
    completedAt: row.completed_at ?? undefined,
    durationSeconds: row.duration_seconds ?? undefined,
    notes: row.notes ?? undefined,
  };
}

function mapExerciseRow(row: {
  id: number;
  workout_id: number;
  name: string;
  muscle_group: string;
  target_sets: number;
  target_reps: string;
  rest_seconds: number;
  order_index: number;
  notes: string | null;
}): Exercise {
  return {
    id: row.id,
    workoutId: row.workout_id,
    name: row.name,
    muscleGroup: row.muscle_group as Exercise["muscleGroup"],
    sets: row.target_sets,
    reps: row.target_reps,
    restSeconds: row.rest_seconds,
    orderIndex: row.order_index,
    notes: row.notes ?? undefined,
  };
}

function mapSetRow(row: {
  id: number;
  exercise_id: number;
  set_number: number;
  target_reps: number;
  actual_reps: number | null;
  weight_kg: number | null;
  completed: number;
  rest_seconds: number;
  completed_at: string | null;
}): ExerciseSet {
  return {
    id: row.id,
    exerciseId: row.exercise_id,
    setNumber: row.set_number,
    targetReps: row.target_reps,
    actualReps: row.actual_reps ?? undefined,
    weightKg: row.weight_kg ?? undefined,
    completed: row.completed === 1,
    restSeconds: row.rest_seconds,
    completedAt: row.completed_at ?? undefined,
  };
}
