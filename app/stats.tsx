import { eachDayOfInterval, format, subDays } from 'date-fns';
import { Dimensions, ScrollView, Text, View } from 'react-native';
import { useHabits } from '../contexts/HabitsContext';
import { useAppTheme } from './theme/ThemeContext';
// import {
//     VictoryAxis,
//     VictoryBar,
//     VictoryChart,
//     VictoryTheme
// } from 'victory-native';

const screenWidth = Dimensions.get('window').width;

export default function StatsScreen() {
  const { habits, loading } = useHabits();
  const { theme } = useAppTheme();

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center" style={{ backgroundColor: theme.background }}>
        <Text className="text-lg" style={{ color: theme.text.secondary }}>
          Loading...
        </Text>
      </View>
    );
  }

  // Calculate completion data for the last 7 days
  const dates = eachDayOfInterval({
    start: subDays(new Date(), 6),
    end: new Date(),
  });

  const completionData = dates.map(date => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const completedHabits = habits.filter(habit => habit.streaks[dateStr]);
    const percentage = habits.length > 0
      ? (completedHabits.length / habits.length) * 100
      : 0;

    return {
      date: format(date, 'EEE'),
      percentage,
    };
  });

  return (
    <ScrollView className="flex-1 p-4" style={{ backgroundColor: theme.background }}>
      <View className="flex-row justify-between items-center mb-6">
        <Text className="text-2xl font-bold" style={{ color: theme.text.primary }}>
          Statistics
        </Text>
      </View>

      <View className="rounded-xl p-4 mb-6" style={{ backgroundColor: theme.surface }}>
        <Text className="text-lg font-medium mb-4" style={{ color: theme.text.primary }}>
          Last 7 Days
        </Text>
        {/* <VictoryChart
          theme={VictoryTheme.material}
          width={screenWidth - 48}
          height={200}
          domainPadding={20}
        >
          <VictoryAxis
            tickFormat={(t: string) => t}
            style={{
              tickLabels: { fontSize: 12, fill: '#6B7280' },
            }}
          />
          <VictoryAxis
            dependentAxis
            tickFormat={(t: number) => `${t}%`}
            style={{
              tickLabels: { fontSize: 12, fill: '#6B7280' },
            }}
          />
          <VictoryBar
            data={completionData}
            x="date"
            y="percentage"
            style={{
              data: {
                fill: '#10B981',
              },
            }}
            animate={{
              duration: 500,
            }}
          />
        </VictoryChart> */}
      </View>

      <View className="rounded-xl p-4" style={{ backgroundColor: theme.surface }}>
        <Text className="text-lg font-medium mb-4" style={{ color: theme.text.primary }}>
          Habit Summary
        </Text>
        {habits.map(habit => (
          <View key={habit.id} className={`${habits.indexOf(habit) === habits.length - 1 ? '' : 'mb-4'}`}>
            <View className="flex-row justify-between items-center mb-1">
              <Text className="text-base font-medium" style={{ color: theme.text.primary }}>
                {habit.name}
              </Text>
              <Text style={{ color: theme.text.secondary }}>
                {Math.round(habit.completionRate)}% complete
              </Text>
            </View>
            <View className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: theme.border }}>
              <View
                className="h-full"
                style={{
                  width: `${habit.completionRate}%`,
                  backgroundColor: habit.color,
                }}
              />
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}