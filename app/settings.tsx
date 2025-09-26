import * as Notifications from 'expo-notifications';
import { useState } from 'react';
import { Switch, Text, TouchableOpacity, View } from 'react-native';

export default function SettingsScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const toggleNotifications = async () => {
    if (!notificationsEnabled) {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        return;
      }
    }
    setNotificationsEnabled(!notificationsEnabled);
  };

  return (
    <View className="flex-1 bg-background p-4">
      <Text className="text-2xl font-bold text-gray-800 mb-6">Settings</Text>

      <View className="bg-surface rounded-xl">
        <TouchableOpacity
          className="p-4 flex-row items-center justify-between"
          onPress={toggleNotifications}
        >
          <Text className="text-base text-gray-800">Enable Notifications</Text>
          <Switch
            value={notificationsEnabled}
            onValueChange={toggleNotifications}
            trackColor={{ false: '#D1D5DB', true: '#10B981' }}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}