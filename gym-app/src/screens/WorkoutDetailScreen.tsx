import React, { useState, useEffect, useCallback } from "react";
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
import { getWorkoutWithExercises, deleteWorkout } from "../database/repository";
import type { WorkoutWithExercises } from "../types";
import type { RootStackParamList } from "../navigation";

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, "WorkoutDetail">;
  route: RouteProp<RootStackParamList, "WorkoutDetail">;
};

const MUSCLE_GROUP_LABELS: Record<string, string> = {
  peito: "Peito",
  costas: "Costas",
  ombros: "Ombros",
  biceps: "Bíceps",
  triceps: "Tríceps",
  pernas: "Pernas",
  gluteos: "Glúteos",
  abdomen: "Abdômen",
  corpo_inteiro: "Corpo Inteiro",
};

export function WorkoutDetailScreen({ navigation, route }: Props) {
  const { workoutId } = route.params;
  const [workout, setWorkout] = useState<WorkoutWithExercises | null>(null);

  const loadWorkout = useCallback(async () => {
    const data = await getWorkoutWithExercises(workoutId);
    setWorkout(data);
  }, [workoutId]);

  useEffect(() => {
    loadWorkout();
  }, [loadWorkout]);

  const handleDelete = () => {
    Alert.alert("Excluir Treino", "Tem certeza que deseja excluir este treino?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: async () => {
          await deleteWorkout(workoutId);
          navigation.goBack();
        },
      },
    ]);
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return "--";
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    if (h > 0) return `${h}h ${m}min`;
    return `${m} min`;
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("pt-BR", {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!workout) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.loadingText}>Carregando...</Text>
      </SafeAreaView>
    );
  }

  const totalVolume = workout.exercises.reduce(
    (sum, e) =>
      sum +
      e.completedSets
        .filter((s) => s.completed)
        .reduce((setSum, s) => setSum + (s.actualReps ?? 0) * (s.weightKg ?? 0), 0),
    0
  );

  const totalCompletedSets = workout.exercises.reduce(
    (sum, e) => sum + e.completedSets.filter((s) => s.completed).length,
    0
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.workoutName}>{workout.name}</Text>
          <View style={styles.focusBadge}>
            <Text style={styles.focusBadgeText}>{workout.focusLabel}</Text>
          </View>
          <Text style={styles.date}>{formatDate(workout.createdAt)}</Text>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Ionicons name="timer-outline" size={24} color={colors.secondary} />
            <Text style={styles.statValue}>{formatDuration(workout.durationSeconds)}</Text>
            <Text style={styles.statLabel}>Duração</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="barbell-outline" size={24} color={colors.primary} />
            <Text style={styles.statValue}>{totalCompletedSets}</Text>
            <Text style={styles.statLabel}>Séries</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="trending-up-outline" size={24} color={colors.success} />
            <Text style={styles.statValue}>{Math.round(totalVolume)}</Text>
            <Text style={styles.statLabel}>Volume (kg)</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Exercícios</Text>

        {workout.exercises.map((exercise) => (
          <View key={exercise.id} style={styles.exerciseCard}>
            <View style={styles.exerciseHeader}>
              <Text style={styles.exerciseName}>{exercise.name}</Text>
              <View style={styles.muscleBadge}>
                <Text style={styles.muscleBadgeText}>
                  {MUSCLE_GROUP_LABELS[exercise.muscleGroup] ?? exercise.muscleGroup}
                </Text>
              </View>
            </View>

            <View style={styles.setsTable}>
              <View style={styles.setsHeaderRow}>
                <Text style={[styles.setsHeaderCell, styles.setNumCol]}>Série</Text>
                <Text style={[styles.setsHeaderCell, styles.repsCol]}>Reps</Text>
                <Text style={[styles.setsHeaderCell, styles.weightCol]}>Carga (kg)</Text>
                <Text style={[styles.setsHeaderCell, styles.statusCol]}>Status</Text>
              </View>
              {exercise.completedSets.map((set) => (
                <View key={set.id} style={styles.setsRow}>
                  <Text style={[styles.setsCell, styles.setNumCol]}>{set.setNumber}</Text>
                  <Text style={[styles.setsCell, styles.repsCol]}>
                    {set.completed ? set.actualReps : set.targetReps}
                  </Text>
                  <Text style={[styles.setsCell, styles.weightCol]}>
                    {set.completed ? set.weightKg ?? "--" : "--"}
                  </Text>
                  <View style={styles.statusCol}>
                    <Ionicons
                      name={set.completed ? "checkmark-circle" : "close-circle"}
                      size={18}
                      color={set.completed ? colors.success : colors.textMuted}
                    />
                  </View>
                </View>
              ))}
            </View>
          </View>
        ))}

        <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete}>
          <Ionicons name="trash-outline" size={18} color={colors.danger} />
          <Text style={styles.deleteBtnText}>Excluir Treino</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingText: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    textAlign: "center",
    marginTop: spacing.xxl,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  header: {
    marginBottom: spacing.lg,
  },
  workoutName: {
    fontSize: fontSize.xxl,
    fontWeight: "800",
    color: colors.text,
    marginBottom: spacing.sm,
  },
  focusBadge: {
    backgroundColor: colors.primaryDark,
    borderRadius: borderRadius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    alignSelf: "flex-start",
    marginBottom: spacing.sm,
  },
  focusBadgeText: {
    fontSize: fontSize.sm,
    color: colors.primaryLight,
    fontWeight: "600",
  },
  date: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
  },
  statsRow: {
    flexDirection: "row",
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    alignItems: "center",
    gap: spacing.xs,
  },
  statValue: {
    fontSize: fontSize.xl,
    fontWeight: "800",
    color: colors.text,
  },
  statLabel: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
  },
  sectionTitle: {
    fontSize: fontSize.xl,
    fontWeight: "700",
    color: colors.text,
    marginBottom: spacing.md,
  },
  exerciseCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  exerciseHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  exerciseName: {
    fontSize: fontSize.md,
    fontWeight: "700",
    color: colors.text,
    flex: 1,
  },
  muscleBadge: {
    backgroundColor: colors.primaryDark,
    borderRadius: borderRadius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  muscleBadgeText: {
    fontSize: fontSize.xs,
    color: colors.primaryLight,
    fontWeight: "600",
  },
  setsTable: {
    gap: spacing.xs,
  },
  setsHeaderRow: {
    flexDirection: "row",
    paddingBottom: spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    marginBottom: spacing.xs,
  },
  setsHeaderCell: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
    fontWeight: "600",
    textTransform: "uppercase",
  },
  setsRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
  },
  setsCell: {
    fontSize: fontSize.sm,
    color: colors.text,
  },
  setNumCol: {
    width: 50,
    textAlign: "center",
  },
  repsCol: {
    flex: 1,
    textAlign: "center",
  },
  weightCol: {
    flex: 1,
    textAlign: "center",
  },
  statusCol: {
    width: 40,
    alignItems: "center",
  },
  deleteBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    paddingVertical: spacing.md,
    marginTop: spacing.lg,
    borderWidth: 1,
    borderColor: colors.danger,
    borderRadius: borderRadius.md,
  },
  deleteBtnText: {
    fontSize: fontSize.md,
    color: colors.danger,
    fontWeight: "600",
  },
});
