import { Ionicons } from "@expo/vector-icons";
import Constants from "expo-constants";
import * as Notifications from "expo-notifications";
import { Tabs } from "expo-router";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { HabitsProvider } from "../contexts/HabitsContext";
import "../global.css";
import { ThemeProvider, useAppTheme } from "./theme/ThemeContext";

// Only configure notifications if not in Expo Go
const isExpoGo = Constants.appOwnership === "expo";

if (!isExpoGo) {
  // Configure notifications
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
}

export default function RootLayout() {
  useEffect(() => {
    // Request notification permissions only if not in Expo Go
    if (!isExpoGo) {
      Notifications.requestPermissionsAsync();
    }
  }, []);

  return (
    <GestureHandlerRootView className="flex-1">
      <ThemeProvider>
        <HabitsProvider>
          <Tabs
            screenOptions={({ navigation }) => {
              const { theme } = useAppTheme();
              return {
                tabBarStyle: {
                  backgroundColor: theme.surface,
                  borderTopWidth: 1,
                  borderTopColor: theme.border,
                },
                tabBarActiveTintColor: theme.primary,
                tabBarInactiveTintColor: theme.text.secondary,
              };
            }}
          >
            <Tabs.Screen
              name="index"
              options={{
                title: "Today",
                tabBarIcon: ({ color, size }) => (
                  <Ionicons name="today-outline" size={size} color={color} />
                ),
              }}
            />
            <Tabs.Screen
              name="habits"
              options={{
                title: "Habits",
                tabBarIcon: ({ color, size }) => (
                  <Ionicons name="list-outline" size={size} color={color} />
                ),
              }}
            />
            <Tabs.Screen
              name="stats"
              options={{
                title: "Stats",
                tabBarIcon: ({ color, size }) => (
                  <Ionicons
                    name="stats-chart-outline"
                    size={size}
                    color={color}
                  />
                ),
              }}
            />
            <Tabs.Screen
              name="settings"
              options={{
                title: "Settings",
                tabBarIcon: ({ color, size }) => (
                  <Ionicons name="settings-outline" size={size} color={color} />
                ),
              }}
            />
          </Tabs>
        </HabitsProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
