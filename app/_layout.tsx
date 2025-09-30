import { Ionicons } from "@expo/vector-icons";
import Constants from "expo-constants";
import * as Notifications from "expo-notifications";
import { Tabs } from "expo-router";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "../global.css";
import { HabitsProvider } from "./contexts/HabitsContext";

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
    <GestureHandlerRootView style={{ flex: 1 }}>
      <HabitsProvider>
        <Tabs
          screenOptions={{
            tabBarStyle: {
              backgroundColor: "white",
              borderTopWidth: 1,
              borderTopColor: "#E5E7EB",
            },
            tabBarActiveTintColor: "#10B981",
            tabBarInactiveTintColor: "#6B7280",
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
    </GestureHandlerRootView>
  );
}
