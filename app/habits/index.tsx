import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import HabitListItem from '../components/HabitListItem';
import { useHabits } from '../contexts/HabitsContext';

export default function HabitsScreen() {
  const { habits, loading } = useHabits();

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <Text className="text-secondary text-lg">Loading...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      <ScrollView className="flex-1 p-4">
        <View className="flex-row justify-between items-center mb-6">
          <Text className="text-2xl font-bold text-gray-800">My Habits</Text>
          <Link href="/habits/new" asChild>
            <TouchableOpacity className="bg-primary p-2 rounded-full">
              <Ionicons name="add" size={24} color="white" />
            </TouchableOpacity>
          </Link>
        </View>

        {habits.length === 0 ? (
          <View className="items-center justify-center py-8">
            <Text className="text-secondary text-lg mb-2">No habits yet</Text>
            <Text className="text-secondary text-base">
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