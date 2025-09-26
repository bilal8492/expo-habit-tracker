import { eachDayOfInterval, format, subDays } from 'date-fns';
import { Dimensions, ScrollView, Text, View } from 'react-native';
// import {
//     VictoryAxis,
//     VictoryBar,
//     VictoryChart,
//     VictoryTheme
// } from 'victory-native';
import { useHabits } from './hooks/useHabits';

const screenWidth = Dimensions.get('window').width;

export default function StatsScreen() {
  const { habits, loading } = useHabits();

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <Text className="text-secondary text-lg">Loading...</Text>
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
    <ScrollView className="flex-1 bg-background p-4">
      <Text className="text-2xl font-bold text-gray-800 mb-6">Statistics</Text>

      <View className="bg-surface rounded-xl p-4 mb-6">
        <Text className="text-lg font-medium text-gray-800 mb-4">
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

      <View className="bg-surface rounded-xl p-4">
        <Text className="text-lg font-medium text-gray-800 mb-4">
          Habit Summary
        </Text>
        {habits.map(habit => (
          <View key={habit.id} className="mb-4 last:mb-0">
            <View className="flex-row justify-between items-center mb-1">
              <Text className="text-base font-medium text-gray-800">
                {habit.name}
              </Text>
              <Text className="text-secondary">
                {Math.round(habit.completionRate)}% complete
              </Text>
            </View>
            <View className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <View
                className="h-full bg-primary"
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