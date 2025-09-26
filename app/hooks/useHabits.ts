import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import { useCallback, useEffect, useState } from 'react';

// Disable notifications in Expo Go as they're not supported in SDK 53
const isExpoGo = Constants.appOwnership === 'expo';

interface Habit {
  id: string;
  name: string;
  color: string;
  reminderTime?: string;
  createdAt: string;
  streaks: { [date: string]: boolean };
}

export interface HabitWithStats extends Habit {
  currentStreak: number;
  longestStreak: number;
  completionRate: number;
}

const HABITS_STORAGE_KEY = '@habits';

// Helper functions
const scheduleNotification = async (habit: Habit) => {
  if (!habit.reminderTime || isExpoGo) return;

  try {
    const [hours, minutes] = habit.reminderTime.split(':').map(Number);
    const identifier = `habit-${habit.id}`;

    // Cancel any existing notification for this habit
    await Notifications.cancelScheduledNotificationAsync(identifier);

    // Schedule new notification
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Habit Reminder',
        body: `Time to complete your habit: ${habit.name}`,
      },
      trigger: {
        hour: hours,
        minute: minutes,
        repeats: true,
      } as any,
      identifier,
    });
  } catch (error) {
    console.warn('Failed to schedule notification:', error);
  }
};

const cancelNotification = async (habitId: string) => {
  if (isExpoGo) return;
  try {
    await Notifications.cancelScheduledNotificationAsync(`habit-${habitId}`);
  } catch (error) {
    console.warn('Failed to cancel notification:', error);
  }
};

export const useHabits = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHabits();
  }, []);

  const loadHabits = async () => {
    try {
      const stored = await AsyncStorage.getItem(HABITS_STORAGE_KEY);
      if (stored) {
        setHabits(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading habits:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveHabits = async (newHabits: Habit[]) => {
    try {
      await AsyncStorage.setItem(HABITS_STORAGE_KEY, JSON.stringify(newHabits));
      setHabits(newHabits);
    } catch (error) {
      console.error('Error saving habits:', error);
    }
  };

  const addHabit = useCallback(async (habit: Omit<Habit, 'id' | 'createdAt' | 'streaks'>) => {
    const newHabit: Habit = {
      ...habit,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      streaks: {},
    };

    if (habit.reminderTime) {
      await scheduleNotification(newHabit);
    }

    const newHabits = [...habits, newHabit];
    await saveHabits(newHabits);
  }, [habits]);

  const toggleHabitForDate = useCallback(async (habitId: string, date: string) => {
    const newHabits = habits.map(habit => {
      if (habit.id === habitId) {
        return {
          ...habit,
          streaks: {
            ...habit.streaks,
            [date]: !habit.streaks[date],
          },
        };
      }
      return habit;
    });
    await saveHabits(newHabits);
  }, [habits]);

  const deleteHabit = useCallback(async (habitId: string) => {
    const habit = habits.find(h => h.id === habitId);
    if (habit?.reminderTime) {
      await cancelNotification(habitId);
    }
    const newHabits = habits.filter(h => h.id !== habitId);
    await saveHabits(newHabits);
  }, [habits]);

  const updateHabit = useCallback(async (habitId: string, updates: Partial<Habit>) => {
    const newHabits = habits.map(habit => {
      if (habit.id === habitId) {
        const updatedHabit = { ...habit, ...updates };
        if (updates.reminderTime !== undefined) {
          if (updates.reminderTime) {
            scheduleNotification(updatedHabit);
          } else {
            cancelNotification(habitId);
          }
        }
        return updatedHabit;
      }
      return habit;
    });
    await saveHabits(newHabits);
  }, [habits]);

  const getHabitWithStats = useCallback((habit: Habit): HabitWithStats => {
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;
    let completedDays = 0;
    let totalDays = 0;

    const dates = Object.keys(habit.streaks).sort();
    dates.forEach((date, index) => {
      if (habit.streaks[date]) {
        tempStreak++;
        completedDays++;
        if (tempStreak > longestStreak) {
          longestStreak = tempStreak;
        }
        if (index === dates.length - 1) {
          currentStreak = tempStreak;
        }
      } else {
        if (index === dates.length - 1) {
          currentStreak = 0;
        }
        tempStreak = 0;
      }
      totalDays++;
    });

    return {
      ...habit,
      currentStreak,
      longestStreak,
      completionRate: totalDays > 0 ? (completedDays / totalDays) * 100 : 0,
    };
  }, []);

  const habitsWithStats = habits.map(getHabitWithStats);

  return {
    habits: habitsWithStats,
    loading,
    addHabit,
    updateHabit,
    deleteHabit,
    toggleHabitForDate,
  };
};