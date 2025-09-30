import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import HabitListItem from '../../components/habit/HabitListItem';
import { useHabits } from '../../contexts/HabitsContext';
import { useAppTheme } from '../theme/ThemeContext';

export default function HabitsScreen() {
  const { habits, loading } = useHabits();
  const { theme } = useAppTheme();

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center" style={{ backgroundColor: theme.background }}>
        <Text className="text-lg" style={{ color: theme.text.secondary }}>Loading...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1" style={{ backgroundColor: theme.background }}>
    <ScrollView className="flex-1 p-4" style={{ backgroundColor: theme.background }}>
        <View className="flex-row justify-between items-center mb-6">
          <Text className="text-2xl font-bold" style={{ color: theme.text.primary }}>My Habits</Text>
          <Link href="/habits/new" asChild>
            <TouchableOpacity className="p-2 rounded-full" style={{ backgroundColor: theme.primary }}>
              <Ionicons name="add" size={24} color={theme.surface} />
            </TouchableOpacity>
          </Link>
        </View>

        {habits.length === 0 ? (
          <View className="items-center justify-center py-8">
            <Text className="text-lg mb-2" style={{ color: theme.text.secondary }}>
              No habits yet
            </Text>
            <Text className="text-base" style={{ color: theme.text.secondary }}>
              Tap the + button to add your first habit
            </Text>
          </View>
        ) : (
          habits.map(habit => (
            <HabitListItem key={habit.id} habit={habit} showStreak={true} />
          ))
        )}
      </ScrollView>
    </View>
  );
}