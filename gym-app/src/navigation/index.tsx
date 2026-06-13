import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../theme";
import { HomeScreen } from "../screens/HomeScreen";
import { GenerateWorkoutScreen } from "../screens/GenerateWorkoutScreen";
import { ActiveWorkoutScreen } from "../screens/ActiveWorkoutScreen";
import { WorkoutDetailScreen } from "../screens/WorkoutDetailScreen";
import { PerformanceScreen } from "../screens/PerformanceScreen";

export type RootStackParamList = {
  MainTabs: undefined;
  Home: undefined;
  GenerateWorkout: undefined;
  ActiveWorkout: { workoutId: number };
  WorkoutDetail: { workoutId: number };
  Performance: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          height: 80,
          paddingBottom: 20,
          paddingTop: 8,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        headerStyle: {
          backgroundColor: colors.background,
        },
        headerTintColor: colors.text,
        headerTitleStyle: {
          fontWeight: "700",
        },
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{
          title: "Treinos",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="barbell" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="PerformanceTab"
        component={PerformanceScreen}
        options={{
          title: "Performance",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="analytics" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerTintColor: colors.text,
          headerTitleStyle: {
            fontWeight: "700",
          },
          contentStyle: {
            backgroundColor: colors.background,
          },
        }}
      >
        <Stack.Screen
          name="MainTabs"
          component={TabNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="GenerateWorkout"
          component={GenerateWorkoutScreen}
          options={{ title: "Gerar Treino" }}
        />
        <Stack.Screen
          name="ActiveWorkout"
          component={ActiveWorkoutScreen}
          options={{
            title: "Treino",
            headerBackVisible: false,
            gestureEnabled: false,
          }}
        />
        <Stack.Screen
          name="WorkoutDetail"
          component={WorkoutDetailScreen}
          options={{ title: "Detalhes do Treino" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
