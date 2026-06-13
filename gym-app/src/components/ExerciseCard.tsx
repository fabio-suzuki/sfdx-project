import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, borderRadius, fontSize } from "../theme";
import type { ExerciseWithSets } from "../types";
import { SetRow } from "./SetRow";

interface ExerciseCardProps {
  exercise: ExerciseWithSets;
  onCompleteSet: (setId: number, reps: number, weight: number) => void;
  isResting: boolean;
}

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

export function ExerciseCard({ exercise, onCompleteSet, isResting }: ExerciseCardProps) {
  const completedCount = exercise.completedSets.filter((s) => s.completed).length;
  const totalSets = exercise.completedSets.length;
  const isComplete = completedCount === totalSets;

  return (
    <View style={[styles.container, isComplete && styles.completeContainer]}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.exerciseName}>{exercise.name}</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              {MUSCLE_GROUP_LABELS[exercise.muscleGroup] ?? exercise.muscleGroup}
            </Text>
          </View>
        </View>
        <View style={styles.progressContainer}>
          {isComplete ? (
            <Ionicons name="checkmark-circle" size={24} color={colors.success} />
          ) : (
            <Text style={styles.progressText}>
              {completedCount}/{totalSets}
            </Text>
          )}
        </View>
      </View>

      <View style={styles.info}>
        <View style={styles.infoItem}>
          <Ionicons name="repeat" size={14} color={colors.textMuted} />
          <Text style={styles.infoText}>
            {exercise.sets}x{exercise.reps}
          </Text>
        </View>
        <View style={styles.infoItem}>
          <Ionicons name="timer-outline" size={14} color={colors.textMuted} />
          <Text style={styles.infoText}>{exercise.restSeconds}s descanso</Text>
        </View>
      </View>

      <View style={styles.setsContainer}>
        {exercise.completedSets.map((set) => (
          <SetRow
            key={set.id}
            set={set}
            onComplete={onCompleteSet}
            disabled={isResting}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  completeContainer: {
    borderLeftColor: colors.success,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: spacing.sm,
  },
  headerLeft: {
    flex: 1,
  },
  exerciseName: {
    fontSize: fontSize.lg,
    fontWeight: "700",
    color: colors.text,
    marginBottom: spacing.xs,
  },
  badge: {
    backgroundColor: colors.primaryDark,
    borderRadius: borderRadius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    alignSelf: "flex-start",
  },
  badgeText: {
    fontSize: fontSize.xs,
    color: colors.primaryLight,
    fontWeight: "600",
  },
  progressContainer: {
    paddingLeft: spacing.sm,
  },
  progressText: {
    fontSize: fontSize.md,
    fontWeight: "700",
    color: colors.textSecondary,
  },
  info: {
    flexDirection: "row",
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  infoText: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
  },
  setsContainer: {
    gap: spacing.xs,
  },
});
