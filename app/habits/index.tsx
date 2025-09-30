import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
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
            <Link
              key={habit.id}
              href={{
                pathname: "/habits/[id]",
                params: { id: habit.id }
              }}
              asChild
            >
              <TouchableOpacity className="bg-surface rounded-xl p-4 mb-4">
                <View className="flex-row items-center mb-2">
                  <View
                    className="w-10 h-10 rounded-full mr-3 items-center justify-center"
                    style={{ backgroundColor: habit.color + '20' }}
                  >
                    <View
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: habit.color }}
                    />
                  </View>
                  <Text className="text-lg font-medium text-gray-800 flex-1">
                    {habit.name}
                  </Text>
                  <Ionicons
                    name="chevron-forward"
                    size={20}
                    color="#6B7280"
                  />
                </View>
                
                <View className="flex-row items-center mt-2">
                  <View className="flex-1">
                    <Text className="text-secondary">
                      {habit.currentStreak} day streak
                    </Text>
                  </View>
                  <Text className="text-secondary">
                    {Math.round(habit.completionRate)}% complete
                  </Text>
                </View>
              </TouchableOpacity>
            </Link>
          ))
        )}
      </ScrollView>
    </View>
  );
}