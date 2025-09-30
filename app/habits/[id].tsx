import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useHabits } from '../../contexts/HabitsContext';
import { useAppTheme } from '../theme/ThemeContext';

const COLORS = [
  '#10B981', // Emerald
  '#3B82F6', // Blue
  '#8B5CF6', // Purple
  '#EC4899', // Pink
  '#F59E0B', // Orange
  '#EF4444', // Red
];

export default function EditHabitScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { habits, updateHabit, deleteHabit } = useHabits();
  const { theme } = useAppTheme();
  const habit = habits.find(h => h.id === id);

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('');
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [reminderTime, setReminderTime] = useState<string | undefined>();

  useEffect(() => {
    if (habit) {
      setName(habit.name);
      setSelectedColor(habit.color);
      setReminderTime(habit.reminderTime);
    } else {
      router.replace('/habits');
    }
  }, [habit, router]);

  if (!habit) {
    return null;
  }

  const handleUpdate = async () => {
    if (name.trim()) {
      await updateHabit(habit.id, {
        name: name.trim(),
        color: selectedColor,
        reminderTime,
      });
      setIsEditing(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Habit',
      `Are you sure you want to delete "${habit.name}"?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deleteHabit(habit.id);
            router.replace('/habits');
          },
        },
      ],
    );
  };

  const handleTimeChange = (_: any, date?: Date) => {
    setShowTimePicker(false);
    if (date) {
      setReminderTime(format(date, 'HH:mm'));
    }
  };

  return (
    <ScrollView className="flex-1" style={{ backgroundColor: theme.background }}>
      <View className="p-4">
        <View className="flex-row justify-between items-center mb-6">
          {isEditing ? (
            <Text className="text-2xl font-bold" style={{ color: theme.text.primary }}>
              Edit Habit
            </Text>
          ) : (
            <>
              <Text className="text-2xl font-bold" style={{ color: theme.text.primary }}>
                {habit.name}
              </Text>
              <View className="flex-row">
                <TouchableOpacity
                  className="p-2 rounded-full mr-2"
                  style={{ backgroundColor: habit.color + '20' }}
                  onPress={() => setIsEditing(true)}
                >
                  <Ionicons name="create-outline" size={24} color={habit.color} />
                </TouchableOpacity>
                <TouchableOpacity
                  className="p-2 rounded-full"
                  style={{ backgroundColor: '#EF4444' + '20' }}
                  onPress={handleDelete}
                >
                  <Ionicons name="trash-outline" size={24} color="#EF4444" />
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>

        {isEditing ? (
          <View className="rounded-xl p-4 mb-6" style={{ backgroundColor: theme.surface }}>
            <Text className="text-base font-medium mb-2" style={{ color: theme.text.primary }}>
              Name
            </Text>
            <TextInput
              className="rounded-lg px-4 py-3 mb-4 border"
              style={{ 
                backgroundColor: theme.background,
                borderColor: theme.border,
                color: theme.text.primary
              }}
              placeholder="Enter habit name"
              placeholderTextColor={theme.text.secondary}
              value={name}
              onChangeText={setName}
            />

            <Text className="text-base font-medium mb-2" style={{ color: theme.text.primary }}>
              Color
            </Text>
            <View className="flex-row flex-wrap gap-2 mb-4">
              {COLORS.map(color => (
                <TouchableOpacity
                  key={color}
                  className="w-10 h-10 rounded-full"
                  style={{ 
                    backgroundColor: color,
                    borderWidth: color === selectedColor ? 2 : 0,
                    borderColor: theme.text.primary
                  }}
                  onPress={() => setSelectedColor(color)}
                />
              ))}
            </View>

            <Text className="text-base font-medium mb-2" style={{ color: theme.text.primary }}>
              Reminder
            </Text>
            <TouchableOpacity
              className="rounded-lg px-4 py-3 mb-4 border"
              style={{ 
                backgroundColor: theme.background,
                borderColor: theme.border
              }}
              onPress={() => setShowTimePicker(true)}
            >
              <Text style={{ color: theme.text.primary }}>
                {reminderTime || 'Set reminder time'}
              </Text>
            </TouchableOpacity>

            {showTimePicker && (
              <DateTimePicker
                value={reminderTime ? new Date(`2000-01-01T${reminderTime}:00`) : new Date()}
                mode="time"
                is24Hour={true}
                onChange={handleTimeChange}
              />
            )}

            <View className="flex-row gap-2">
              <TouchableOpacity
                className="flex-1 py-3 rounded-lg"
                style={{ backgroundColor: theme.border }}
                onPress={() => setIsEditing(false)}
              >
                <Text className="text-center font-medium" style={{ color: theme.text.primary }}>
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-1 py-3 rounded-lg"
                style={{ backgroundColor: theme.primary }}
                onPress={handleUpdate}
              >
                <Text className="text-center font-medium text-white">
                  Save Changes
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View className="rounded-xl p-4 mb-6" style={{ backgroundColor: theme.surface }}>
            <View className="flex-row items-center mb-4">
              <View className="w-10 h-10 rounded-full mr-3 items-center justify-center" 
                style={{ backgroundColor: habit.color + '20' }}>
                <View className="w-6 h-6 rounded-full" 
                  style={{ backgroundColor: habit.color }} />
              </View>
              <View>
                <Text className="text-lg font-semibold mb-1" style={{ color: theme.text.primary }}>
                  {habit.name}
                </Text>
                {habit.reminderTime && (
                  <Text style={{ color: theme.text.secondary }}>
                    Reminder at {habit.reminderTime}
                  </Text>
                )}
              </View>
            </View>

            <View className="mt-4">
              <View className="flex-row justify-between mb-4">
                <View>
                  <Text className="mb-1" style={{ color: theme.text.secondary }}>
                    Current Streak
                  </Text>
                  <Text className="text-2xl font-bold" style={{ color: theme.text.primary }}>
                    {habit.currentStreak} days
                  </Text>
                </View>
                <View>
                  <Text className="mb-1" style={{ color: theme.text.secondary }}>
                    Longest Streak
                  </Text>
                  <Text className="text-2xl font-bold" style={{ color: theme.text.primary }}>
                    {habit.longestStreak} days
                  </Text>
                </View>
              </View>

              <View>
                <Text className="mb-1" style={{ color: theme.text.secondary }}>
                  Completion Rate
                </Text>
                <View className="flex-row items-center">
                  <View className="flex-1 h-2 rounded-full overflow-hidden mr-3" 
                    style={{ backgroundColor: theme.border }}>
                    <View
                      className="h-full"
                      style={{
                        width: `${habit.completionRate}%`,
                        backgroundColor: habit.color,
                      }}
                    />
                  </View>
                  <Text className="font-medium" style={{ color: theme.text.primary }}>
                    {Math.round(habit.completionRate)}%
                  </Text>
                </View>
              </View>
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
}