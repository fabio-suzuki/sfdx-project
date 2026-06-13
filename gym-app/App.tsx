import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";
import { AppNavigator } from "./src/navigation";
import { getDatabase } from "./src/database";
import { colors } from "./src/theme";

export default function App() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    async function init() {
      await getDatabase();
      setIsReady(true);
    }
    init();
  }, []);

  if (!isReady) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Preparando...</Text>
      </View>
    );
  }

  return (
    <>
      <StatusBar style="light" />
      <AppNavigator />
    </>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
    gap: 16,
  },
  loadingText: {
    color: colors.textSecondary,
    fontSize: 16,
  },
});
