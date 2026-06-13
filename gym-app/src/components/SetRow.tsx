import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, borderRadius, fontSize } from "../theme";
import type { ExerciseSet } from "../types";

interface SetRowProps {
  set: ExerciseSet;
  onComplete: (setId: number, reps: number, weight: number) => void;
  disabled?: boolean;
}

export function SetRow({ set, onComplete, disabled }: SetRowProps) {
  const [reps, setReps] = useState(set.actualReps?.toString() ?? set.targetReps.toString());
  const [weight, setWeight] = useState(set.weightKg?.toString() ?? "");

  const handleComplete = () => {
    if (!set.id) return;
    const repsNum = parseInt(reps, 10) || 0;
    const weightNum = parseFloat(weight) || 0;
    onComplete(set.id, repsNum, weightNum);
  };

  return (
    <View style={[styles.container, set.completed && styles.completedContainer]}>
      <View style={styles.setNumber}>
        <Text style={[styles.setNumberText, set.completed && styles.completedText]}>
          {set.setNumber}
        </Text>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Reps</Text>
        <TextInput
          style={[styles.input, set.completed && styles.completedInput]}
          value={reps}
          onChangeText={setReps}
          keyboardType="numeric"
          editable={!set.completed && !disabled}
          placeholder={set.targetReps.toString()}
          placeholderTextColor={colors.textMuted}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Kg</Text>
        <TextInput
          style={[styles.input, set.completed && styles.completedInput]}
          value={weight}
          onChangeText={setWeight}
          keyboardType="decimal-pad"
          editable={!set.completed && !disabled}
          placeholder="0"
          placeholderTextColor={colors.textMuted}
        />
      </View>

      <TouchableOpacity
        style={[styles.completeBtn, set.completed && styles.completedBtn]}
        onPress={handleComplete}
        disabled={set.completed || disabled}
      >
        <Ionicons
          name={set.completed ? "checkmark-circle" : "checkmark-circle-outline"}
          size={32}
          color={set.completed ? colors.success : colors.textMuted}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surfaceLight,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
    gap: spacing.md,
  },
  completedContainer: {
    backgroundColor: colors.surfaceHighlight,
    opacity: 0.8,
  },
  setNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  setNumberText: {
    color: colors.white,
    fontWeight: "700",
    fontSize: fontSize.sm,
  },
  completedText: {
    color: colors.success,
  },
  inputGroup: {
    flex: 1,
  },
  inputLabel: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
    marginBottom: 2,
  },
  input: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    color: colors.text,
    fontSize: fontSize.md,
    fontWeight: "600",
    textAlign: "center",
  },
  completedInput: {
    color: colors.success,
  },
  completeBtn: {
    padding: spacing.xs,
  },
  completedBtn: {
    opacity: 1,
  },
});
