import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

const HABITS_STORAGE_KEY = '@habits';
const isExpoGo = Constants.appOwnership === 'expo';

interface Habit {
  id: string;
  name: string;
  color: string;
  reminderTime?: string;
  createdAt: string;
  streaks: { [date: string]: boolean };
}

interface HabitWithStats extends Habit {
  currentStreak: number;
  longestStreak: number;
  completionRate: number;
}

interface HabitsContextType {
  habits: HabitWithStats[];
  loading: boolean;
  addHabit: (habit: Omit<Habit, 'id' | 'createdAt' | 'streaks'>) => Promise<Habit>;
  updateHabit: (habitId: string, updates: Partial<Habit>) => Promise<void>;
  deleteHabit: (habitId: string) => Promise<void>;
  toggleHabitForDate: (habitId: string, date: string) => Promise<void>;
  refreshHabits: () => Promise<void>;
}

const HabitsContext = createContext<HabitsContextType | undefined>(undefined);

// Helper functions
const scheduleNotification = async (habit: Habit) => {
  if (!habit.reminderTime || isExpoGo) return;

  try {
    const [hours, minutes] = habit.reminderTime.split(':').map(Number);
    const identifier = `habit-${habit.id}`;

    await Notifications.cancelScheduledNotificationAsync(identifier);

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

export function HabitsProvider({ children }: { children: React.ReactNode }) {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    loadHabits();
  }, []);

  const refreshHabits = useCallback(async () => {
    await loadHabits();
  }, []);

  const saveHabits = async (newHabits: Habit[]) => {
    try {
      await AsyncStorage.setItem(HABITS_STORAGE_KEY, JSON.stringify(newHabits));
      setHabits(newHabits);
    } catch (error) {
      console.error('Error saving habits:', error);
      throw error;
    }
  };

  const addHabit = useCallback(async (habit: Omit<Habit, 'id' | 'createdAt' | 'streaks'>) => {
    const newHabit: Habit = {
      ...habit,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      streaks: {},
    };

    try {
      if (habit.reminderTime) {
        await scheduleNotification(newHabit);
      }

      const newHabits = [...habits, newHabit];
      await saveHabits(newHabits);
      return newHabit;
    } catch (error) {
      console.error('Error adding habit:', error);
      throw error;
    }
  }, [habits]);

  const toggleHabitForDate = useCallback(async (habitId: string, date: string) => {
    try {
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
    } catch (error) {
      console.error('Error toggling habit:', error);
      throw error;
    }
  }, [habits]);

  const deleteHabit = useCallback(async (habitId: string) => {
    try {
      const habit = habits.find(h => h.id === habitId);
      if (habit?.reminderTime) {
        await cancelNotification(habitId);
      }
      const newHabits = habits.filter(h => h.id !== habitId);
      await saveHabits(newHabits);
    } catch (error) {
      console.error('Error deleting habit:', error);
      throw error;
    }
  }, [habits]);

  const updateHabit = useCallback(async (habitId: string, updates: Partial<Habit>) => {
    try {
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
    } catch (error) {
      console.error('Error updating habit:', error);
      throw error;
    }
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

  const value = {
    habits: habits.map(getHabitWithStats),
    loading,
    addHabit,
    updateHabit,
    deleteHabit,
    toggleHabitForDate,
    refreshHabits,
  };

  return <HabitsContext.Provider value={value}>{children}</HabitsContext.Provider>;
}

export const useHabits = () => {
  const context = useContext(HabitsContext);
  if (context === undefined) {
    throw new Error('useHabits must be used within a HabitsProvider');
  }
  return context;
};