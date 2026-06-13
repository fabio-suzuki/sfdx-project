import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { colors, spacing, borderRadius, fontSize } from "../theme";
import { WORKOUT_FOCUS_OPTIONS, generateWorkout } from "../ai/workoutGenerator";
import { createWorkout, createExercise, createExerciseSet } from "../database/repository";
import type { WorkoutFocus } from "../types";
import type { RootStackParamList } from "../navigation";

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, "GenerateWorkout">;
};

export function GenerateWorkoutScreen({ navigation }: Props) {
  const [selectedFocus, setSelectedFocus] = useState<WorkoutFocus | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!selectedFocus) {
      Alert.alert("Selecione o foco", "Escolha o foco do treino antes de gerar.");
      return;
    }

    setIsGenerating(true);
    try {
      const focusOption = WORKOUT_FOCUS_OPTIONS.find((f) => f.id === selectedFocus)!;
      const generated = generateWorkout(selectedFocus);

      const workoutId = await createWorkout({
        name: generated.name,
        focus: selectedFocus,
        focusLabel: focusOption.label,
      });

      for (const exercise of generated.exercises) {
        const exerciseId = await createExercise({
          workoutId,
          name: exercise.name,
          muscleGroup: exercise.muscleGroup,
          sets: exercise.sets,
          reps: exercise.reps,
          restSeconds: exercise.restSeconds,
          orderIndex: exercise.orderIndex,
        });

        const targetReps = parseInt(exercise.reps.split("-")[0], 10) || 12;
        for (let i = 1; i <= exercise.sets; i++) {
          await createExerciseSet({
            exerciseId,
            setNumber: i,
            targetReps,
            completed: false,
            restSeconds: exercise.restSeconds,
          });
        }
      }

      navigation.replace("ActiveWorkout", { workoutId });
    } catch (error) {
      Alert.alert("Erro", "Não foi possível gerar o treino. Tente novamente.");
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Ionicons name="flash" size={40} color={colors.primary} />
          <Text style={styles.title}>Qual o foco de hoje?</Text>
          <Text style={styles.subtitle}>
            A IA vai gerar um treino personalizado baseado na sua escolha
          </Text>
        </View>

        <View style={styles.optionsGrid}>
          {WORKOUT_FOCUS_OPTIONS.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={[styles.optionCard, selectedFocus === option.id && styles.selectedCard]}
              onPress={() => setSelectedFocus(option.id)}
            >
              <View style={styles.optionHeader}>
                <Ionicons
                  name="barbell"
                  size={24}
                  color={selectedFocus === option.id ? colors.primary : colors.textSecondary}
                />
                {selectedFocus === option.id && (
                  <Ionicons name="checkmark-circle" size={20} color={colors.primary} />
                )}
              </View>
              <Text
                style={[
                  styles.optionLabel,
                  selectedFocus === option.id && styles.selectedLabel,
                ]}
              >
                {option.label}
              </Text>
              <Text style={styles.optionDesc}>{option.description}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.generateButton, !selectedFocus && styles.generateButtonDisabled]}
          onPress={handleGenerate}
          disabled={!selectedFocus || isGenerating}
        >
          {isGenerating ? (
            <ActivityIndicator color={colors.white} size="small" />
          ) : (
            <>
              <Ionicons name="flash" size={22} color={colors.white} />
              <Text style={styles.generateButtonText}>Gerar Treino</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: 120,
  },
  header: {
    alignItems: "center",
    marginBottom: spacing.xl,
    paddingTop: spacing.md,
  },
  title: {
    fontSize: fontSize.xxl,
    fontWeight: "800",
    color: colors.text,
    marginTop: spacing.md,
    textAlign: "center",
  },
  subtitle: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    marginTop: spacing.sm,
    textAlign: "center",
    lineHeight: 22,
  },
  optionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.md,
  },
  optionCard: {
    width: "47%",
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 2,
    borderColor: "transparent",
  },
  selectedCard: {
    borderColor: colors.primary,
    backgroundColor: colors.surfaceLight,
  },
  optionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  optionLabel: {
    fontSize: fontSize.md,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 4,
  },
  selectedLabel: {
    color: colors.primary,
  },
  optionDesc: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
    lineHeight: 16,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.lg,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  generateButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
  },
  generateButtonDisabled: {
    opacity: 0.5,
  },
  generateButtonText: {
    fontSize: fontSize.lg,
    fontWeight: "700",
    color: colors.white,
  },
});
