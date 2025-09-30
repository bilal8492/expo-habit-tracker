import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useHabits } from '../contexts/HabitsContext';

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
    <ScrollView className="flex-1 bg-background">
      <View className="p-4">
        <View className="flex-row justify-between items-center mb-6">
          {isEditing ? (
            <Text className="text-2xl font-bold text-gray-800">Edit Habit</Text>
          ) : (
            <>
              <Text className="text-2xl font-bold text-gray-800">{habit.name}</Text>
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
          <View className="bg-surface rounded-xl p-4 mb-6">
            <Text className="text-base font-medium text-gray-800 mb-2">Name</Text>
            <TextInput
              className="bg-white border border-gray-200 rounded-lg px-4 py-3 mb-4"
              placeholder="Enter habit name"
              value={name}
              onChangeText={setName}
            />

            <Text className="text-base font-medium text-gray-800 mb-2">Color</Text>
            <View className="flex-row flex-wrap gap-2 mb-4">
              {COLORS.map(color => (
                <TouchableOpacity
                  key={color}
                  className={`w-10 h-10 rounded-full ${
                    color === selectedColor ? 'border-2 border-gray-800' : ''
                  }`}
                  style={{ backgroundColor: color }}
                  onPress={() => setSelectedColor(color)}
                />
              ))}
            </View>

            <Text className="text-base font-medium text-gray-800 mb-2">Reminder</Text>
            <TouchableOpacity
              className="bg-white border border-gray-200 rounded-lg px-4 py-3 mb-4"
              onPress={() => setShowTimePicker(true)}
            >
              <Text className="text-gray-800">
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
                className="flex-1 bg-gray-200 py-3 rounded-lg"
                onPress={() => setIsEditing(false)}
              >
                <Text className="text-gray-800 text-center font-medium">
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-1 bg-primary py-3 rounded-lg"
                onPress={handleUpdate}
              >
                <Text className="text-white text-center font-medium">
                  Save Changes
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
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

            <View className="mt-4">
              <View className="flex-row justify-between mb-4">
                <View>
                  <Text className="text-secondary mb-1">Current Streak</Text>
                  <Text className="text-2xl font-bold text-gray-800">
                    {habit.currentStreak} days
                  </Text>
                </View>
                <View>
                  <Text className="text-secondary mb-1">Longest Streak</Text>
                  <Text className="text-2xl font-bold text-gray-800">
                    {habit.longestStreak} days
                  </Text>
                </View>
              </View>

              <View>
                <Text className="text-secondary mb-1">Completion Rate</Text>
                <View className="flex-row items-center">
                  <View className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden mr-3">
                    <View
                      className="h-full"
                      style={{
                        width: `${habit.completionRate}%`,
                        backgroundColor: habit.color,
                      }}
                    />
                  </View>
                  <Text className="text-gray-800 font-medium">
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