export interface Habit {
  id: string;
  name: string;
  color: string;
  reminderTime?: string;
  createdAt: string;
  streaks: { [date: string]: boolean };
}

export type HabitWithStats = Habit & {
  currentStreak: number;
  longestStreak: number;
  completionRate: number;
};