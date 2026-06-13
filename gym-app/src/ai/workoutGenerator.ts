import type { WorkoutFocus, WorkoutFocusOption, MuscleGroup } from "../types";

export const WORKOUT_FOCUS_OPTIONS: WorkoutFocusOption[] = [
  {
    id: "peito_triceps",
    label: "Peito + Tríceps",
    description: "Supino, crucifixo, extensões",
    icon: "fitness-center",
    muscleGroups: ["peito", "triceps"],
  },
  {
    id: "costas_biceps",
    label: "Costas + Bíceps",
    description: "Puxadas, remadas, rosca",
    icon: "fitness-center",
    muscleGroups: ["costas", "biceps"],
  },
  {
    id: "pernas_gluteos",
    label: "Pernas + Glúteos",
    description: "Agachamento, leg press, extensora",
    icon: "fitness-center",
    muscleGroups: ["pernas", "gluteos"],
  },
  {
    id: "ombros_abdomen",
    label: "Ombros + Abdômen",
    description: "Desenvolvimento, elevações, prancha",
    icon: "fitness-center",
    muscleGroups: ["ombros", "abdomen"],
  },
  {
    id: "push",
    label: "Push Day",
    description: "Peito, ombros, tríceps",
    icon: "fitness-center",
    muscleGroups: ["peito", "ombros", "triceps"],
  },
  {
    id: "pull",
    label: "Pull Day",
    description: "Costas, bíceps, antebraço",
    icon: "fitness-center",
    muscleGroups: ["costas", "biceps"],
  },
  {
    id: "legs",
    label: "Leg Day",
    description: "Quadríceps, posterior, panturrilha",
    icon: "fitness-center",
    muscleGroups: ["pernas", "gluteos"],
  },
  {
    id: "superior",
    label: "Superior Completo",
    description: "Peito, costas, ombros, braços",
    icon: "fitness-center",
    muscleGroups: ["peito", "costas", "ombros", "biceps", "triceps"],
  },
  {
    id: "inferior",
    label: "Inferior Completo",
    description: "Quadríceps, posterior, glúteos, panturrilha",
    icon: "fitness-center",
    muscleGroups: ["pernas", "gluteos"],
  },
  {
    id: "corpo_inteiro",
    label: "Corpo Inteiro",
    description: "Full body workout",
    icon: "fitness-center",
    muscleGroups: ["peito", "costas", "pernas", "ombros", "abdomen"],
  },
];

interface ExerciseTemplate {
  name: string;
  muscleGroup: MuscleGroup;
  defaultSets: number;
  defaultReps: string;
  restSeconds: number;
  isCompound: boolean;
}

const EXERCISE_DATABASE: ExerciseTemplate[] = [
  // Peito
  { name: "Supino Reto com Barra", muscleGroup: "peito", defaultSets: 4, defaultReps: "8-12", restSeconds: 90, isCompound: true },
  { name: "Supino Inclinado com Halteres", muscleGroup: "peito", defaultSets: 4, defaultReps: "10-12", restSeconds: 90, isCompound: true },
  { name: "Supino Declinado", muscleGroup: "peito", defaultSets: 3, defaultReps: "10-12", restSeconds: 90, isCompound: true },
  { name: "Crucifixo com Halteres", muscleGroup: "peito", defaultSets: 3, defaultReps: "12-15", restSeconds: 60, isCompound: false },
  { name: "Crossover na Polia", muscleGroup: "peito", defaultSets: 3, defaultReps: "12-15", restSeconds: 60, isCompound: false },
  { name: "Fly na Máquina (Peck Deck)", muscleGroup: "peito", defaultSets: 3, defaultReps: "12-15", restSeconds: 60, isCompound: false },
  { name: "Flexão de Braço", muscleGroup: "peito", defaultSets: 3, defaultReps: "15-20", restSeconds: 60, isCompound: true },
  { name: "Supino com Halteres Reto", muscleGroup: "peito", defaultSets: 4, defaultReps: "10-12", restSeconds: 90, isCompound: true },

  // Costas
  { name: "Puxada Frontal na Polia", muscleGroup: "costas", defaultSets: 4, defaultReps: "8-12", restSeconds: 90, isCompound: true },
  { name: "Remada Curvada com Barra", muscleGroup: "costas", defaultSets: 4, defaultReps: "8-12", restSeconds: 90, isCompound: true },
  { name: "Remada Baixa na Polia", muscleGroup: "costas", defaultSets: 4, defaultReps: "10-12", restSeconds: 90, isCompound: true },
  { name: "Remada Unilateral com Halter", muscleGroup: "costas", defaultSets: 3, defaultReps: "10-12", restSeconds: 60, isCompound: true },
  { name: "Pulldown com Triângulo", muscleGroup: "costas", defaultSets: 3, defaultReps: "10-12", restSeconds: 60, isCompound: true },
  { name: "Barra Fixa (Pull-up)", muscleGroup: "costas", defaultSets: 3, defaultReps: "6-10", restSeconds: 90, isCompound: true },
  { name: "Remada Cavalinho (T-Bar)", muscleGroup: "costas", defaultSets: 3, defaultReps: "10-12", restSeconds: 90, isCompound: true },
  { name: "Pullover na Polia", muscleGroup: "costas", defaultSets: 3, defaultReps: "12-15", restSeconds: 60, isCompound: false },

  // Ombros
  { name: "Desenvolvimento com Halteres", muscleGroup: "ombros", defaultSets: 4, defaultReps: "8-12", restSeconds: 90, isCompound: true },
  { name: "Elevação Lateral", muscleGroup: "ombros", defaultSets: 4, defaultReps: "12-15", restSeconds: 60, isCompound: false },
  { name: "Elevação Frontal", muscleGroup: "ombros", defaultSets: 3, defaultReps: "12-15", restSeconds: 60, isCompound: false },
  { name: "Desenvolvimento Arnold", muscleGroup: "ombros", defaultSets: 3, defaultReps: "10-12", restSeconds: 90, isCompound: true },
  { name: "Face Pull", muscleGroup: "ombros", defaultSets: 3, defaultReps: "15-20", restSeconds: 60, isCompound: false },
  { name: "Elevação Lateral na Polia", muscleGroup: "ombros", defaultSets: 3, defaultReps: "12-15", restSeconds: 60, isCompound: false },
  { name: "Encolhimento com Halteres", muscleGroup: "ombros", defaultSets: 3, defaultReps: "12-15", restSeconds: 60, isCompound: false },
  { name: "Desenvolvimento Militar", muscleGroup: "ombros", defaultSets: 4, defaultReps: "8-10", restSeconds: 90, isCompound: true },

  // Bíceps
  { name: "Rosca Direta com Barra", muscleGroup: "biceps", defaultSets: 3, defaultReps: "10-12", restSeconds: 60, isCompound: false },
  { name: "Rosca Alternada com Halteres", muscleGroup: "biceps", defaultSets: 3, defaultReps: "10-12", restSeconds: 60, isCompound: false },
  { name: "Rosca Martelo", muscleGroup: "biceps", defaultSets: 3, defaultReps: "10-12", restSeconds: 60, isCompound: false },
  { name: "Rosca Scott", muscleGroup: "biceps", defaultSets: 3, defaultReps: "10-12", restSeconds: 60, isCompound: false },
  { name: "Rosca na Polia Baixa", muscleGroup: "biceps", defaultSets: 3, defaultReps: "12-15", restSeconds: 60, isCompound: false },
  { name: "Rosca Concentrada", muscleGroup: "biceps", defaultSets: 3, defaultReps: "10-12", restSeconds: 60, isCompound: false },

  // Tríceps
  { name: "Tríceps Pulley (Polia Alta)", muscleGroup: "triceps", defaultSets: 3, defaultReps: "10-12", restSeconds: 60, isCompound: false },
  { name: "Tríceps Testa com Barra EZ", muscleGroup: "triceps", defaultSets: 3, defaultReps: "10-12", restSeconds: 60, isCompound: false },
  { name: "Tríceps Francês com Halter", muscleGroup: "triceps", defaultSets: 3, defaultReps: "10-12", restSeconds: 60, isCompound: false },
  { name: "Mergulho em Paralelas", muscleGroup: "triceps", defaultSets: 3, defaultReps: "8-12", restSeconds: 90, isCompound: true },
  { name: "Tríceps Corda na Polia", muscleGroup: "triceps", defaultSets: 3, defaultReps: "12-15", restSeconds: 60, isCompound: false },
  { name: "Tríceps Banco", muscleGroup: "triceps", defaultSets: 3, defaultReps: "12-15", restSeconds: 60, isCompound: true },

  // Pernas
  { name: "Agachamento Livre", muscleGroup: "pernas", defaultSets: 4, defaultReps: "8-12", restSeconds: 120, isCompound: true },
  { name: "Leg Press 45°", muscleGroup: "pernas", defaultSets: 4, defaultReps: "10-12", restSeconds: 120, isCompound: true },
  { name: "Cadeira Extensora", muscleGroup: "pernas", defaultSets: 3, defaultReps: "12-15", restSeconds: 60, isCompound: false },
  { name: "Mesa Flexora", muscleGroup: "pernas", defaultSets: 3, defaultReps: "12-15", restSeconds: 60, isCompound: false },
  { name: "Agachamento Hack", muscleGroup: "pernas", defaultSets: 3, defaultReps: "10-12", restSeconds: 90, isCompound: true },
  { name: "Cadeira Adutora", muscleGroup: "pernas", defaultSets: 3, defaultReps: "12-15", restSeconds: 60, isCompound: false },
  { name: "Cadeira Abdutora", muscleGroup: "pernas", defaultSets: 3, defaultReps: "12-15", restSeconds: 60, isCompound: false },
  { name: "Panturrilha em Pé", muscleGroup: "pernas", defaultSets: 4, defaultReps: "15-20", restSeconds: 60, isCompound: false },
  { name: "Panturrilha Sentado", muscleGroup: "pernas", defaultSets: 3, defaultReps: "15-20", restSeconds: 60, isCompound: false },
  { name: "Passada com Halteres", muscleGroup: "pernas", defaultSets: 3, defaultReps: "12-15", restSeconds: 90, isCompound: true },
  { name: "Stiff (Levantamento Terra Romeno)", muscleGroup: "pernas", defaultSets: 4, defaultReps: "10-12", restSeconds: 90, isCompound: true },
  { name: "Agachamento Búlgaro", muscleGroup: "pernas", defaultSets: 3, defaultReps: "10-12", restSeconds: 90, isCompound: true },

  // Glúteos
  { name: "Hip Thrust", muscleGroup: "gluteos", defaultSets: 4, defaultReps: "10-12", restSeconds: 90, isCompound: true },
  { name: "Elevação Pélvica", muscleGroup: "gluteos", defaultSets: 3, defaultReps: "15-20", restSeconds: 60, isCompound: false },
  { name: "Kickback na Polia", muscleGroup: "gluteos", defaultSets: 3, defaultReps: "12-15", restSeconds: 60, isCompound: false },
  { name: "Agachamento Sumô", muscleGroup: "gluteos", defaultSets: 3, defaultReps: "12-15", restSeconds: 90, isCompound: true },

  // Abdômen
  { name: "Prancha Abdominal", muscleGroup: "abdomen", defaultSets: 3, defaultReps: "30-60s", restSeconds: 45, isCompound: false },
  { name: "Abdominal Crunch", muscleGroup: "abdomen", defaultSets: 3, defaultReps: "15-20", restSeconds: 45, isCompound: false },
  { name: "Abdominal Infra na Barra", muscleGroup: "abdomen", defaultSets: 3, defaultReps: "12-15", restSeconds: 45, isCompound: false },
  { name: "Russian Twist", muscleGroup: "abdomen", defaultSets: 3, defaultReps: "20-30", restSeconds: 45, isCompound: false },
  { name: "Abdominal na Polia", muscleGroup: "abdomen", defaultSets: 3, defaultReps: "15-20", restSeconds: 45, isCompound: false },
  { name: "Abdominal Bicicleta", muscleGroup: "abdomen", defaultSets: 3, defaultReps: "20-30", restSeconds: 45, isCompound: false },
];

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function getExercisesPerGroup(totalGroups: number): number {
  if (totalGroups <= 2) return 4;
  if (totalGroups <= 3) return 3;
  return 2;
}

export interface GeneratedExercise {
  name: string;
  muscleGroup: MuscleGroup;
  sets: number;
  reps: string;
  restSeconds: number;
  orderIndex: number;
}

export function generateWorkout(focus: WorkoutFocus): {
  name: string;
  exercises: GeneratedExercise[];
} {
  const focusOption = WORKOUT_FOCUS_OPTIONS.find((f) => f.id === focus);
  if (!focusOption) throw new Error(`Unknown focus: ${focus}`);

  const muscleGroups = focusOption.muscleGroups;
  const exercisesPerGroup = getExercisesPerGroup(muscleGroups.length);
  const selectedExercises: GeneratedExercise[] = [];
  let orderIndex = 0;

  for (const group of muscleGroups) {
    const available = EXERCISE_DATABASE.filter((e) => e.muscleGroup === group);
    const shuffled = shuffleArray(available);
    const compounds = shuffled.filter((e) => e.isCompound);
    const isolations = shuffled.filter((e) => !e.isCompound);

    const picked: ExerciseTemplate[] = [];
    if (compounds.length > 0) {
      picked.push(compounds[0]);
    }
    const remaining = [...compounds.slice(1), ...isolations];
    for (const ex of remaining) {
      if (picked.length >= exercisesPerGroup) break;
      picked.push(ex);
    }

    for (const ex of picked) {
      selectedExercises.push({
        name: ex.name,
        muscleGroup: ex.muscleGroup,
        sets: ex.defaultSets,
        reps: ex.defaultReps,
        restSeconds: ex.restSeconds,
        orderIndex: orderIndex++,
      });
    }
  }

  const dayNames: Record<string, string> = {
    "0": "Domingo",
    "1": "Segunda",
    "2": "Terça",
    "3": "Quarta",
    "4": "Quinta",
    "5": "Sexta",
    "6": "Sábado",
  };
  const today = new Date();
  const dayName = dayNames[today.getDay().toString()];
  const name = `${focusOption.label} - ${dayName}`;

  return { name, exercises: selectedExercises };
}
