import React, { useState, useCallback, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Alert,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RouteProp } from "@react-navigation/native";
import { colors, spacing, borderRadius, fontSize } from "../theme";
import {
  getWorkoutWithExercises,
  updateExerciseSet,
  completeWorkout,
} from "../database/repository";
import type { WorkoutWithExercises } from "../types";
import { ExerciseCard } from "../components/ExerciseCard";
import { RestTimer } from "../components/RestTimer";
import type { RootStackParamList } from "../navigation";

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, "ActiveWorkout">;
  route: RouteProp<RootStackParamList, "ActiveWorkout">;
};

export function ActiveWorkoutScreen({ navigation, route }: Props) {
  const { workoutId } = route.params;
  const [workout, setWorkout] = useState<WorkoutWithExercises | null>(null);
  const [showRestTimer, setShowRestTimer] = useState(false);
  const [restSeconds, setRestSeconds] = useState(60);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const startTimeRef = useRef(Date.now());
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const loadWorkout = useCallback(async () => {
    const data = await getWorkoutWithExercises(workoutId);
    setWorkout(data);
  }, [workoutId]);

  useEffect(() => {
    loadWorkout();
  }, [loadWorkout]);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setElapsedSeconds(Math.floor((Date.now() - startTimeRef.current) / 1000));
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const handleCompleteSet = async (setId: number, reps: number, weight: number) => {
    await updateExerciseSet(setId, {
      actualReps: reps,
      weightKg: weight,
      completed: true,
    });

    const set = workout?.exercises
      .flatMap((e) => e.completedSets)
      .find((s) => s.id === setId);

    if (set) {
      setRestSeconds(set.restSeconds);
      setShowRestTimer(true);
    }

    await loadWorkout();
  };

  const handleFinishWorkout = () => {
    Alert.alert("Finalizar Treino", "Deseja finalizar o treino atual?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Finalizar",
        style: "destructive",
        onPress: async () => {
          const duration = Math.floor((Date.now() - startTimeRef.current) / 1000);
          await completeWorkout(workoutId, duration);
          navigation.popTo("Home");
        },
      },
    ]);
  };

  const formatElapsed = (secs: number) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    if (h > 0) {
      return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
    }
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  if (!workout) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Carregando treino...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const totalSets = workout.exercises.reduce((sum, e) => sum + e.completedSets.length, 0);
  const completedSets = workout.exercises.reduce(
    (sum, e) => sum + e.completedSets.filter((s) => s.completed).length,
    0
  );
  const progress = totalSets > 0 ? completedSets / totalSets : 0;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <View style={styles.topBarLeft}>
          <Text style={styles.workoutName} numberOfLines={1}>
            {workout.name}
          </Text>
          <View style={styles.timerBadge}>
            <Ionicons name="timer-outline" size={14} color={colors.secondary} />
            <Text style={styles.timerText}>{formatElapsed(elapsedSeconds)}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.finishBtn} onPress={handleFinishWorkout}>
          <Text style={styles.finishBtnText}>Finalizar</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
      </View>
      <Text style={styles.progressText}>
        {completedSets}/{totalSets} séries concluídas
      </Text>

      {showRestTimer && (
        <RestTimer
          initialSeconds={restSeconds}
          onComplete={() => setShowRestTimer(false)}
          onSkip={() => setShowRestTimer(false)}
        />
      )}

      <ScrollView
        style={styles.exerciseList}
        contentContainerStyle={styles.exerciseListContent}
        showsVerticalScrollIndicator={false}
      >
        {workout.exercises.map((exercise) => (
          <ExerciseCard
            key={exercise.id}
            exercise={exercise}
            onCompleteSet={handleCompleteSet}
            isResting={showRestTimer}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  topBarLeft: {
    flex: 1,
  },
  workoutName: {
    fontSize: fontSize.xl,
    fontWeight: "800",
    color: colors.text,
  },
  timerBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: spacing.xs,
  },
  timerText: {
    fontSize: fontSize.md,
    fontWeight: "700",
    color: colors.secondary,
    fontVariant: ["tabular-nums"],
  },
  finishBtn: {
    backgroundColor: colors.danger,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
  },
  finishBtnText: {
    fontSize: fontSize.sm,
    fontWeight: "700",
    color: colors.white,
  },
  progressBar: {
    height: 6,
    backgroundColor: colors.surfaceLight,
    marginHorizontal: spacing.lg,
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: colors.primary,
    borderRadius: 3,
  },
  progressText: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
    paddingHorizontal: spacing.lg,
    marginTop: spacing.xs,
    marginBottom: spacing.md,
  },
  exerciseList: {
    flex: 1,
  },
  exerciseListContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
  },
});
