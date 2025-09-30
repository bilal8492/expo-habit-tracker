import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { useState } from "react";
import { Alert, Platform, Text, TouchableOpacity, View } from "react-native";
import { useHabits } from "../contexts/HabitsContext";
import { HabitWithStats } from "../types/habit";

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

  return (
    <View className="bg-surface rounded-xl p-4 mb-4 last:mb-0">
      <View className="flex-row justify-between items-center">
        <View className="flex-1">
          <Text className="text-lg font-medium text-gray-800 mb-1">
            {habit.name}
          </Text>
          {showStreak && (
            <Text className="text-secondary">
              Current streak: {habit.currentStreak} days
            </Text>
          )}
        </View>
        <View className="flex-row items-center">
          <Link href={`/habits/${habit.id}`} asChild>
            <TouchableOpacity
              className="p-2 rounded-full mr-2"
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
          <Text style={{ color: habit.color }}>
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
