export type MuscleGroup =
  | "peito"
  | "costas"
  | "ombros"
  | "biceps"
  | "triceps"
  | "pernas"
  | "gluteos"
  | "abdomen"
  | "corpo_inteiro";

export type WorkoutFocus =
  | "peito_triceps"
  | "costas_biceps"
  | "pernas_gluteos"
  | "ombros_abdomen"
  | "superior"
  | "inferior"
  | "corpo_inteiro"
  | "push"
  | "pull"
  | "legs";

export interface WorkoutFocusOption {
  id: WorkoutFocus;
  label: string;
  description: string;
  icon: string;
  muscleGroups: MuscleGroup[];
}

export interface Exercise {
  id?: number;
  workoutId: number;
  name: string;
  muscleGroup: MuscleGroup;
  sets: number;
  reps: string;
  restSeconds: number;
  orderIndex: number;
  notes?: string;
}

export interface ExerciseSet {
  id?: number;
  exerciseId: number;
  setNumber: number;
  targetReps: number;
  actualReps?: number;
  weightKg?: number;
  completed: boolean;
  restSeconds: number;
  completedAt?: string;
}

export interface Workout {
  id?: number;
  name: string;
  focus: WorkoutFocus;
  focusLabel: string;
  createdAt: string;
  completedAt?: string;
  durationSeconds?: number;
  notes?: string;
}

export interface WorkoutWithExercises extends Workout {
  exercises: ExerciseWithSets[];
}

export interface ExerciseWithSets extends Exercise {
  completedSets: ExerciseSet[];
}

export interface PerformanceRecord {
  date: string;
  focus: WorkoutFocus;
  focusLabel: string;
  totalVolume: number;
  totalSets: number;
  durationMinutes: number;
}
