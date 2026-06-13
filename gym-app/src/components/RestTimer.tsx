import React, { useState, useEffect, useCallback, useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Vibration } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, borderRadius, fontSize } from "../theme";

interface RestTimerProps {
  initialSeconds: number;
  onComplete: () => void;
  onSkip: () => void;
}

export function RestTimer({ initialSeconds, onComplete, onSkip }: RestTimerProps) {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(true);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isRunning && seconds > 0) {
      intervalRef.current = setInterval(() => {
        setSeconds((prev) => {
          if (prev <= 1) {
            Vibration.vibrate([0, 500, 200, 500]);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, seconds]);

  useEffect(() => {
    if (seconds === 0 && isRunning) {
      setIsRunning(false);
      onComplete();
    }
  }, [seconds, isRunning, onComplete]);

  const togglePause = useCallback(() => {
    setIsRunning((prev) => !prev);
  }, []);

  const addTime = useCallback((amount: number) => {
    setSeconds((prev) => Math.max(0, prev + amount));
  }, []);

  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const progress = seconds / initialSeconds;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tempo de Descanso</Text>

      <View style={styles.timerCircle}>
        <View
          style={[
            styles.progressRing,
            {
              borderColor: progress > 0.3 ? colors.primary : colors.danger,
            },
          ]}
        >
          <Text style={styles.timerText}>
            {minutes}:{secs.toString().padStart(2, "0")}
          </Text>
        </View>
      </View>

      <View style={styles.adjustButtons}>
        <TouchableOpacity style={styles.adjustBtn} onPress={() => addTime(-15)}>
          <Text style={styles.adjustBtnText}>-15s</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.pauseBtn} onPress={togglePause}>
          <Ionicons name={isRunning ? "pause" : "play"} size={28} color={colors.white} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.adjustBtn} onPress={() => addTime(15)}>
          <Text style={styles.adjustBtnText}>+15s</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.skipButton} onPress={onSkip}>
        <Text style={styles.skipText}>Pular Descanso</Text>
        <Ionicons name="play-skip-forward" size={18} color={colors.primaryLight} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    marginVertical: spacing.md,
  },
  title: {
    fontSize: fontSize.lg,
    fontWeight: "700",
    color: colors.text,
    marginBottom: spacing.lg,
  },
  timerCircle: {
    marginBottom: spacing.lg,
  },
  progressRing: {
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 6,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.surfaceLight,
  },
  timerText: {
    fontSize: 48,
    fontWeight: "700",
    color: colors.text,
    fontVariant: ["tabular-nums"],
  },
  adjustButtons: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  adjustBtn: {
    backgroundColor: colors.surfaceLight,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
  },
  adjustBtnText: {
    color: colors.textSecondary,
    fontSize: fontSize.md,
    fontWeight: "600",
  },
  pauseBtn: {
    backgroundColor: colors.primary,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
  },
  skipButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    paddingVertical: spacing.sm,
  },
  skipText: {
    color: colors.primaryLight,
    fontSize: fontSize.md,
    fontWeight: "600",
  },
});
