import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useHabits } from '../hooks/useHabits';

const COLORS = [
  '#10B981', // Emerald
  '#3B82F6', // Blue
  '#8B5CF6', // Purple
  '#EC4899', // Pink
  '#F59E0B', // Orange
  '#EF4444', // Red
];

export default function NewHabitScreen() {
  const router = useRouter();
  const { addHabit } = useHabits();
  const [name, setName] = useState('');
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [reminderTime, setReminderTime] = useState<string | null>(null);

  const handleCreate = async () => {
    if (name.trim()) {
      await addHabit({
        name: name.trim(),
        color: selectedColor,
        reminderTime: reminderTime || undefined,
      });
      router.back();
    }
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
        <Text className="text-2xl font-bold text-gray-800 mb-6">
          Create New Habit
        </Text>

        <View className="bg-surface rounded-xl p-4 mb-6">
          <Text className="text-base font-medium text-gray-700 mb-2">
            Habit Name
          </Text>
          <TextInput
            className="bg-gray-100 rounded-lg px-4 py-3 text-base text-gray-800"
            placeholder="Enter habit name"
            value={name}
            onChangeText={setName}
          />
        </View>

        <View className="bg-surface rounded-xl p-4 mb-6">
          <Text className="text-base font-medium text-gray-700 mb-2">
            Color
          </Text>
          <View className="flex-row flex-wrap gap-3">
            {COLORS.map(color => (
              <TouchableOpacity
                key={color}
                onPress={() => setSelectedColor(color)}
                className="w-12 h-12 rounded-full items-center justify-center"
                style={{ backgroundColor: color + '20' }}
              >
                <View
                  className={`w-8 h-8 rounded-full ${
                    selectedColor === color ? 'border-2 border-white' : ''
                  }`}
                  style={{ backgroundColor: color }}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View className="bg-surface rounded-xl p-4 mb-6">
          <Text className="text-base font-medium text-gray-700 mb-2">
            Daily Reminder
          </Text>
          <TouchableOpacity
            className="bg-gray-100 rounded-lg px-4 py-3"
            onPress={() => setShowTimePicker(true)}
          >
            <Text className="text-base text-gray-800">
              {reminderTime
                ? `Remind me at ${reminderTime}`
                : 'Set reminder time (optional)'}
            </Text>
          </TouchableOpacity>
        </View>

        {showTimePicker && (
          <DateTimePicker
            value={
              reminderTime
                ? new Date(`2000-01-01T${reminderTime}:00`)
                : new Date()
            }
            mode="time"
            is24Hour={true}
            onChange={handleTimeChange}
          />
        )}

        <TouchableOpacity
          className={`rounded-xl p-4 ${
            name.trim() ? 'bg-primary' : 'bg-gray-300'
          }`}
          onPress={handleCreate}
          disabled={!name.trim()}
        >
          <Text className="text-white text-center text-lg font-medium">
            Create Habit
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}