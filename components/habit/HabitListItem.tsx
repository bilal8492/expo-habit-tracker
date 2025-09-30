import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { useState } from "react";
import { Alert, Platform, Text, TouchableOpacity, View } from "react-native";
import { useAppTheme } from "../../app/theme/ThemeContext";
import { HabitWithStats } from "../../app/types/habit";
import { useHabits } from "../../contexts/HabitsContext";

interface HabitListItemProps {
  habit: HabitWithStats;
  showStreak?: boolean;
  onToggle?: () => void;
}

export default function HabitListItem({
  habit,
  showStreak,
  onToggle,
}: HabitListItemProps) {
  const { deleteHabit } = useHabits();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (Platform.OS === "web") {
      const confirmed = window.confirm(
        `Are you sure you want to delete "${habit.name}"?`
      );
      if (confirmed) {
        setIsDeleting(true);
        try {
          await deleteHabit(habit.id);
        } catch (error) {
          Alert.alert("Error", "Failed to delete habit");
        } finally {
          setIsDeleting(false);
        }
      }
    } else {
      Alert.alert(
        "Delete Habit",
        `Are you sure you want to delete "${habit.name}"?`,
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Delete",
            style: "destructive",
            onPress: async () => {
              setIsDeleting(true);
              try {
                await deleteHabit(habit.id);
              } catch (error) {
                Alert.alert("Error", "Failed to delete habit");
              } finally {
                setIsDeleting(false);
              }
            },
          },
        ]
      );
    }
  };

  const { theme } = useAppTheme();

  return (
    <View className="rounded-xl p-4 mb-4" style={{ backgroundColor: theme.surface }}>
      <View className="flex-row justify-between items-center">
        <View className="flex-1">
          <Text className="text-lg font-medium mb-1" style={{ color: theme.text.primary }}>
            {habit.name}
          </Text>
          {showStreak && (
            <Text style={{ color: theme.text.secondary }}>
              Current streak: {habit.currentStreak} days
            </Text>
          )}
        </View>
        <View className="flex-row items-center">
          <Link href={`/habits/${habit.id}`} asChild>
            <TouchableOpacity
              className="p-2 mr-2 rounded-full"
              style={{ backgroundColor: habit.color + "20" }}
            >
              <Ionicons name="create-outline" size={20} color={habit.color} />
            </TouchableOpacity>
          </Link>
          <TouchableOpacity
            className="p-2 rounded-full"
            style={{ backgroundColor: "#EF4444" + "20" }}
            onPress={handleDelete}
            disabled={isDeleting}
          >
            <Ionicons
              name={isDeleting ? "hourglass-outline" : "trash-outline"}
              size={20}
              color="#EF4444"
            />
          </TouchableOpacity>
        </View>
      </View>
      {onToggle && (
        <TouchableOpacity
          className="mt-3 p-2 rounded-lg"
          style={{ backgroundColor: habit.color + "20" }}
          onPress={onToggle}
        >
          <Text className="text-center font-medium" style={{ color: habit.color }}>
            Mark as{" "}
            {habit.streaks[new Date().toISOString().split("T")[0]]
              ? "incomplete"
              : "complete"}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
