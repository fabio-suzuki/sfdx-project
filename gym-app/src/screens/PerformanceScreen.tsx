import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { colors, spacing, borderRadius, fontSize } from "../theme";
import { getPerformanceHistory } from "../database/repository";
import type { PerformanceRecord } from "../types";

export function PerformanceScreen() {
  const [records, setRecords] = useState<PerformanceRecord[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(async () => {
    const data = await getPerformanceHistory(50);
    setRecords(data);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const totalWorkouts = records.length;
  const totalVolume = records.reduce((sum, r) => sum + r.totalVolume, 0);
  const totalMinutes = records.reduce((sum, r) => sum + r.durationMinutes, 0);
  const avgDuration = totalWorkouts > 0 ? Math.round(totalMinutes / totalWorkouts) : 0;

  const focusDistribution: Record<string, number> = {};
  for (const record of records) {
    focusDistribution[record.focusLabel] = (focusDistribution[record.focusLabel] ?? 0) + 1;
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      weekday: "short",
    });
  };

  const maxVolume = Math.max(...records.map((r) => r.totalVolume), 1);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <Text style={styles.title}>Performance</Text>
        <Text style={styles.subtitle}>Acompanhe sua evolução</Text>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Ionicons name="calendar-outline" size={24} color={colors.primary} />
            <Text style={styles.statValue}>{totalWorkouts}</Text>
            <Text style={styles.statLabel}>Treinos</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="trending-up-outline" size={24} color={colors.success} />
            <Text style={styles.statValue}>{Math.round(totalVolume).toLocaleString()}</Text>
            <Text style={styles.statLabel}>Volume Total (kg)</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="timer-outline" size={24} color={colors.secondary} />
            <Text style={styles.statValue}>{avgDuration}</Text>
            <Text style={styles.statLabel}>Média (min)</Text>
          </View>
        </View>

        {Object.keys(focusDistribution).length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Distribuição por Foco</Text>
            {Object.entries(focusDistribution)
              .sort(([, a], [, b]) => b - a)
              .map(([label, count]) => (
                <View key={label} style={styles.distributionRow}>
                  <Text style={styles.distributionLabel}>{label}</Text>
                  <View style={styles.distributionBarContainer}>
                    <View
                      style={[
                        styles.distributionBar,
                        { width: `${(count / totalWorkouts) * 100}%` },
                      ]}
                    />
                  </View>
                  <Text style={styles.distributionCount}>{count}x</Text>
                </View>
              ))}
          </View>
        )}

        {records.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Volume por Treino</Text>
            <View style={styles.chartContainer}>
              {records
                .slice(0, 15)
                .reverse()
                .map((record, index) => (
                  <View key={index} style={styles.chartBar}>
                    <View style={styles.chartBarWrapper}>
                      <View
                        style={[
                          styles.chartBarFill,
                          {
                            height: `${(record.totalVolume / maxVolume) * 100}%`,
                          },
                        ]}
                      />
                    </View>
                    <Text style={styles.chartLabel}>{formatDate(record.date)}</Text>
                  </View>
                ))}
            </View>
          </View>
        )}

        {records.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Histórico Detalhado</Text>
            {records.map((record, index) => (
              <View key={index} style={styles.historyCard}>
                <View style={styles.historyHeader}>
                  <Text style={styles.historyDate}>{formatDate(record.date)}</Text>
                  <View style={styles.historyBadge}>
                    <Text style={styles.historyBadgeText}>{record.focusLabel}</Text>
                  </View>
                </View>
                <View style={styles.historyStats}>
                  <View style={styles.historyStatItem}>
                    <Text style={styles.historyStatValue}>{record.totalSets}</Text>
                    <Text style={styles.historyStatLabel}>séries</Text>
                  </View>
                  <View style={styles.historyStatItem}>
                    <Text style={styles.historyStatValue}>
                      {Math.round(record.totalVolume)}
                    </Text>
                    <Text style={styles.historyStatLabel}>kg vol.</Text>
                  </View>
                  <View style={styles.historyStatItem}>
                    <Text style={styles.historyStatValue}>{record.durationMinutes}</Text>
                    <Text style={styles.historyStatLabel}>min</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}

        {records.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="analytics-outline" size={64} color={colors.textMuted} />
            <Text style={styles.emptyText}>Sem dados ainda</Text>
            <Text style={styles.emptySubtext}>
              Complete treinos para ver sua evolução aqui
            </Text>
          </View>
        )}
      </ScrollView>
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
    paddingBottom: spacing.xxl,
  },
  title: {
    fontSize: fontSize.xxl,
    fontWeight: "800",
    color: colors.text,
  },
  subtitle: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    marginTop: spacing.xs,
    marginBottom: spacing.lg,
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
    textAlign: "center",
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: "700",
    color: colors.text,
    marginBottom: spacing.md,
  },
  distributionRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.sm,
    gap: spacing.sm,
  },
  distributionLabel: {
    width: 120,
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  distributionBarContainer: {
    flex: 1,
    height: 12,
    backgroundColor: colors.surfaceLight,
    borderRadius: 6,
    overflow: "hidden",
  },
  distributionBar: {
    height: "100%",
    backgroundColor: colors.primary,
    borderRadius: 6,
  },
  distributionCount: {
    width: 30,
    fontSize: fontSize.sm,
    color: colors.textMuted,
    textAlign: "right",
  },
  chartContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    height: 150,
    gap: 4,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
  },
  chartBar: {
    flex: 1,
    alignItems: "center",
  },
  chartBarWrapper: {
    width: "100%",
    height: 100,
    justifyContent: "flex-end",
  },
  chartBarFill: {
    width: "100%",
    backgroundColor: colors.primary,
    borderRadius: 4,
    minHeight: 4,
  },
  chartLabel: {
    fontSize: 8,
    color: colors.textMuted,
    marginTop: 4,
  },
  historyCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  historyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  historyDate: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    fontWeight: "600",
  },
  historyBadge: {
    backgroundColor: colors.primaryDark,
    borderRadius: borderRadius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  historyBadgeText: {
    fontSize: fontSize.xs,
    color: colors.primaryLight,
    fontWeight: "600",
  },
  historyStats: {
    flexDirection: "row",
    gap: spacing.lg,
  },
  historyStatItem: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 4,
  },
  historyStatValue: {
    fontSize: fontSize.md,
    fontWeight: "700",
    color: colors.text,
  },
  historyStatLabel: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
  },
  emptyState: {
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
    textAlign: "center",
  },
});
