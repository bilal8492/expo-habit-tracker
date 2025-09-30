import { Ionicons } from '@expo/vector-icons';
import * as Notifications from 'expo-notifications';
import { useState } from 'react';
import { Switch, Text, TouchableOpacity, View } from 'react-native';
import { useAppTheme } from './theme/ThemeContext';
import type { ThemeType } from './theme/theme';

export default function SettingsScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const { theme, themePreference, setThemePreference } = useAppTheme();

  const toggleNotifications = async () => {
    if (!notificationsEnabled) {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        return;
      }
    }
    setNotificationsEnabled(!notificationsEnabled);
  };

  const themeOptions: { label: string; value: ThemeType; icon: string }[] = [
    { label: 'System', value: 'system', icon: 'phone-portrait-outline' },
    { label: 'Light', value: 'light', icon: 'sunny-outline' },
    { label: 'Dark', value: 'dark', icon: 'moon-outline' },
  ];

  return (
    <View className="flex-1" style={{ backgroundColor: theme.background }}>
      <View className="p-4">
        <Text className="text-2xl font-bold mb-6" style={{ color: theme.text.primary }}>
          Settings
        </Text>

        <Text className="text-xl font-semibold mb-4" style={{ color: theme.text.primary }}>
          Appearance
        </Text>
        <View className="rounded-xl mb-6" style={{ backgroundColor: theme.surface }}>
          {themeOptions.map((option, index) => (
            <TouchableOpacity
              key={option.value}
              onPress={() => setThemePreference(option.value)}
              className="flex-row items-center p-4"
              style={{
                backgroundColor: theme.surface,
                borderBottomWidth: index < themeOptions.length - 1 ? 1 : 0,
                borderBottomColor: theme.border,
              }}
            >
              <Ionicons
                name={option.icon as any}
                size={24}
                color={themePreference === option.value ? theme.primary : theme.text.secondary}
              />
              <Text
                className={`ml-3 text-base ${themePreference === option.value ? 'font-semibold' : 'font-normal'}`}
                style={{
                  color: themePreference === option.value ? theme.primary : theme.text.primary,
                }}
              >
                {option.label}
              </Text>
              {themePreference === option.value && (
                <Ionicons
                  name="checkmark"
                  size={24}
                  color={theme.primary}
                  className="ml-auto"
                />
              )}
            </TouchableOpacity>
          ))}
        </View>

        <Text className="text-xl font-semibold mb-4" style={{ color: theme.text.primary }}>
          Notifications
        </Text>
        <View className="rounded-xl" style={{ backgroundColor: theme.surface }}>
          <TouchableOpacity
            className="p-4 flex-row items-center justify-between"
            onPress={toggleNotifications}
          >
            <Text className="text-base" style={{ color: theme.text.primary }}>
              Enable Notifications
            </Text>
            <Switch
              value={notificationsEnabled}
              onValueChange={toggleNotifications}
              trackColor={{ false: theme.border, true: theme.primary }}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}