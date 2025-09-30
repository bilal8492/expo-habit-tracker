import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { useEffect } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useHabits } from '../contexts/HabitsContext';
import { useAppTheme } from './theme/ThemeContext';

export default function TodayScreen() {
  const { habits, loading, toggleHabitForDate, refreshHabits } = useHabits();
  const { theme } = useAppTheme();
  const today = format(new Date(), 'yyyy-MM-dd');

  useEffect(() => {
    refreshHabits();
  }, []);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center" style={{ backgroundColor: theme.background }}>
        <Text className="text-lg" style={{ color: theme.text.secondary }}>
          Loading...
        </Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 p-4" style={{ backgroundColor: theme.background }}>
      <Text className="text-2xl font-bold mb-2" style={{ color: theme.text.primary }}>
        Today's Habits
      </Text>
      <Text className="text-base mb-6" style={{ color: theme.text.secondary }}>
        {format(new Date(), 'EEEE, MMMM d')}
      </Text>

      {habits.length === 0 ? (
        <View className="items-center justify-center py-8">
          <Text className="text-lg mb-2" style={{ color: theme.text.secondary }}>
            No habits yet
          </Text>
          <Text className="text-base" style={{ color: theme.text.secondary }}>
            Add some habits to get started
          </Text>
        </View>
      ) : (
        habits.map(habit => (
          <TouchableOpacity
            key={habit.id}
            className="rounded-xl p-4 mb-4 flex-row items-center"
            style={{ backgroundColor: theme.surface }}
            onPress={() => toggleHabitForDate(habit.id, today)}
          >
            <View
              className="w-12 h-12 rounded-full items-center justify-center mr-4"
              style={{ backgroundColor: habit.color + '20' }}
            >
              {habit.streaks[today] ? (
                <Ionicons name="checkmark-circle" size={24} color={habit.color} />
              ) : (
                <View
                  className="w-6 h-6 rounded-full border-2"
                  style={{ borderColor: habit.color }}
                />
              )}
            </View>
            <View className="flex-1">
              <Text className="text-base font-medium" style={{ color: theme.text.primary,
                fontSize: 18,
                fontWeight: '500',
                marginBottom: 4
              }}>
                {habit.name}
              </Text>
              <Text style={{ color: theme.text.secondary }}>
                {habit.currentStreak} day streak
              </Text>
            </View>
          </TouchableOpacity>
        ))
      )}
    </ScrollView>
  );
}
