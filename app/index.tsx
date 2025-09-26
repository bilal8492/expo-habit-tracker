import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { ScrollView, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useHabits } from './hooks/useHabits';

export default function TodayScreen() {
  const { habits, loading, toggleHabitForDate } = useHabits();
  const today = format(new Date(), 'yyyy-MM-dd');

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <Text className="text-secondary text-lg">Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-background p-4">
      <Text className="text-2xl font-bold text-gray-800 mb-2">
        Today's Habits
      </Text>
      <Text className="text-secondary mb-6">
        {format(new Date(), 'EEEE, MMMM d')}
      </Text>

      {habits.length === 0 ? (
        <View className="items-center justify-center py-8">
          <Text className="text-secondary text-lg mb-2">No habits yet</Text>
          <Text className="text-secondary text-base">
            Add some habits to get started
          </Text>
        </View>
      ) : (
        habits.map(habit => (
          <TouchableOpacity
            key={habit.id}
            className="bg-surface rounded-xl p-4 mb-4 flex-row items-center"
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
              <Text className="text-gray-800 text-lg font-medium">
                {habit.name}
              </Text>
              <Text className="text-secondary">
                {habit.currentStreak} day streak
              </Text>
            </View>
          </TouchableOpacity>
        ))
      )}
    </ScrollView>
  );
}
