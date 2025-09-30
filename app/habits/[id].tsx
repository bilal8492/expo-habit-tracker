import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useHabits } from '../contexts/HabitsContext';

export default function HabitDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { habits } = useHabits();
  const habit = habits.find(h => h.id === id);

  useEffect(() => {
    if (!habit) {
      router.replace('/habits');
    }
  }, [habit, router]);

  if (!habit) {
    return null;
  }

  return (
    <ScrollView className="flex-1 bg-background">
      <View className="p-4">
        <Text className="text-2xl font-bold text-gray-800 mb-6">
          {habit.name}
        </Text>

        <View className="bg-surface rounded-xl p-4 mb-6">
          <View className="flex-row items-center mb-4">
            <View
              className="w-10 h-10 rounded-full mr-3 items-center justify-center"
              style={{ backgroundColor: habit.color + '20' }}
            >
              <View
                className="w-6 h-6 rounded-full"
                style={{ backgroundColor: habit.color }}
              />
            </View>
            <View>
              <Text className="text-lg font-semibold text-gray-800">{habit.name}</Text>
              {habit.reminderTime && (
                <Text className="text-secondary">
                  Reminder at {habit.reminderTime}
                </Text>
              )}
            </View>
          </View>

          <View className="bg-background p-4 rounded-lg">
            <View className="flex-row justify-between mb-2">
              <Text className="text-secondary">Current Streak</Text>
              <Text className="font-semibold text-gray-800">
                {habit.currentStreak} days
              </Text>
            </View>
            <View className="flex-row justify-between mb-2">
              <Text className="text-secondary">Longest Streak</Text>
              <Text className="font-semibold text-gray-800">
                {habit.longestStreak} days
              </Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-secondary">Completion Rate</Text>
              <Text className="font-semibold text-gray-800">
                {Math.round(habit.completionRate)}%
              </Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}