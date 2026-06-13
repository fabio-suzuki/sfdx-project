import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { colors, spacing, borderRadius, fontSize } from "../theme";
import { getAllWorkouts } from "../database/repository";
import type { Workout } from "../types";
import type { RootStackParamList } from "../navigation";

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, "Home">;
};

export function HomeScreen({ navigation }: Props) {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadWorkouts = useCallback(async () => {
    const data = await getAllWorkouts();
    setWorkouts(data);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadWorkouts();
    }, [loadWorkouts])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadWorkouts();
    setRefreshing(false);
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return "--";
    const mins = Math.floor(seconds / 60);
    return `${mins} min`;
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const recentWorkouts = workouts.filter((w) => w.completedAt);
  const activeWorkout = workouts.find((w) => !w.completedAt);

  const renderWorkoutItem = ({ item }: { item: Workout }) => (
    <TouchableOpacity
      style={styles.workoutCard}
      onPress={() => navigation.navigate("WorkoutDetail", { workoutId: item.id! })}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{item.name}</Text>
        <View style={styles.completedBadge}>
          <Ionicons name="checkmark-circle" size={14} color={colors.success} />
          <Text style={styles.completedText}>Concluído</Text>
        </View>
      </View>
      <View style={styles.cardInfo}>
        <View style={styles.cardInfoItem}>
          <Ionicons name="calendar-outline" size={14} color={colors.textMuted} />
          <Text style={styles.cardInfoText}>{formatDate(item.createdAt)}</Text>
        </View>
        <View style={styles.cardInfoItem}>
          <Ionicons name="timer-outline" size={14} color={colors.textMuted} />
          <Text style={styles.cardInfoText}>{formatDuration(item.durationSeconds)}</Text>
        </View>
      </View>
      <View style={styles.focusBadge}>
        <Text style={styles.focusBadgeText}>{item.focusLabel}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Bora treinar! 💪</Text>
          <Text style={styles.subtitle}>
            {workouts.length > 0
              ? `${recentWorkouts.length} treinos realizados`
              : "Comece seu primeiro treino"}
          </Text>
        </View>
      </View>

      {activeWorkout && (
        <TouchableOpacity
          style={styles.activeWorkoutCard}
          onPress={() => navigation.navigate("ActiveWorkout", { workoutId: activeWorkout.id! })}
        >
          <View style={styles.activeWorkoutHeader}>
            <Ionicons name="barbell" size={24} color={colors.warning} />
            <Text style={styles.activeWorkoutTitle}>Treino em Andamento</Text>
          </View>
          <Text style={styles.activeWorkoutName}>{activeWorkout.name}</Text>
          <Text style={styles.activeWorkoutAction}>Toque para continuar →</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        style={styles.newWorkoutButton}
        onPress={() => navigation.navigate("GenerateWorkout")}
      >
        <Ionicons name="flash" size={24} color={colors.white} />
        <Text style={styles.newWorkoutButtonText}>Gerar Novo Treino com IA</Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Histórico de Treinos</Text>

      {recentWorkouts.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="barbell-outline" size={64} color={colors.textMuted} />
          <Text style={styles.emptyText}>Nenhum treino ainda</Text>
          <Text style={styles.emptySubtext}>Gere seu primeiro treino com IA!</Text>
        </View>
      ) : (
        <FlatList
          data={recentWorkouts}
          renderItem={renderWorkoutItem}
          keyExtractor={(item) => item.id!.toString()}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  greeting: {
    fontSize: fontSize.xxl,
    fontWeight: "800",
    color: colors.text,
  },
  subtitle: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  activeWorkoutCard: {
    marginHorizontal: spacing.lg,
    backgroundColor: colors.surfaceLight,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.warning,
  },
  activeWorkoutHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },
  activeWorkoutTitle: {
    fontSize: fontSize.sm,
    fontWeight: "700",
    color: colors.warning,
    textTransform: "uppercase",
  },
  activeWorkoutName: {
    fontSize: fontSize.lg,
    fontWeight: "700",
    color: colors.text,
    marginBottom: spacing.xs,
  },
  activeWorkoutAction: {
    fontSize: fontSize.sm,
    color: colors.primaryLight,
    fontWeight: "600",
  },
  newWorkoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    backgroundColor: colors.primary,
    marginHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.lg,
  },
  newWorkoutButtonText: {
    fontSize: fontSize.lg,
    fontWeight: "700",
    color: colors.white,
  },
  sectionTitle: {
    fontSize: fontSize.xl,
    fontWeight: "700",
    color: colors.text,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  workoutCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  cardTitle: {
    fontSize: fontSize.md,
    fontWeight: "700",
    color: colors.text,
    flex: 1,
  },
  completedBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  completedText: {
    fontSize: fontSize.xs,
    color: colors.success,
    fontWeight: "600",
  },
  cardInfo: {
    flexDirection: "row",
    gap: spacing.md,
    marginBottom: spacing.sm,
  },
  cardInfoItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  cardInfoText: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
  },
  focusBadge: {
    backgroundColor: colors.primaryDark,
    borderRadius: borderRadius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    alignSelf: "flex-start",
  },
  focusBadgeText: {
    fontSize: fontSize.xs,
    color: colors.primaryLight,
    fontWeight: "600",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: spacing.xxl,
  },
  emptyText: {
    fontSize: fontSize.lg,
    fontWeight: "600",
    color: colors.textSecondary,
    marginTop: spacing.md,
  },
  emptySubtext: {
    fontSize: fontSize.md,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
  listContent: {
    paddingBottom: spacing.xxl,
  },
});
