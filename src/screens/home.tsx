import { useState, useCallback } from "react";
import { View, Text, ScrollView, Alert } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import dayjs from "dayjs";

import { api } from "../lib/axios";
import { generateRangeDatesFromYearStart } from "../utils/generateRangeBetweenDate";

import { GoalDay, DAY_SIZE } from "../components/goalDay";
import { Header } from "../components/header";
import { Loading } from "../components/loading";

const weekDays = ["D", "S", "T", "Q", "Q", "S", "S"];

const datesFromYearStart = generateRangeDatesFromYearStart();
const minimumSummaryDatesSizes = 20 * 5;
const amountOfDaysFill = minimumSummaryDatesSizes - datesFromYearStart.length;

type SummaryProps = Array<{
  id: String;
  date: string;
  amount: number;
  completed: number;
}>;

export function Home() {
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<SummaryProps | null>(null);

  const { navigate } = useNavigation();

  async function fetchData() {
    try {
      setLoading(true);
      const response = await api.get("/summary");
      setSummary(response.data);
    } catch (error) {
      Alert.alert("Ops", "Não foi possível carregar o sumário de metas.");
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  if (loading) {
    return <Loading />;
  }

  return (
    <View className="flex-1 bg-black px-8 pt-16">
      <Header />

      <View className="flex-row mt-6 mb-2">
        {weekDays.map((weekDay, i) => (
          <Text
            key={`${weekDay}-${i}`}
            className="text-zinc-400 text-xl font-bold text-center mx-1"
            style={{ width: DAY_SIZE }}
          >
            {weekDay}
          </Text>
        ))}
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 100,
        }}
      >
        {summary && (
          <View className="flex-row flex-wrap">
            {datesFromYearStart.map((date) => {
              const dayWithGoal = summary.find((day) => {
                return dayjs(date).isSame(day.date, "day");
              });

              return (
                <GoalDay
                  key={date.toISOString()}
                  date={date}
                  amountOfGoals={dayWithGoal?.amount}
                  amountCompleted={dayWithGoal?.completed}
                  onPress={() => navigate("goal", { date: date.toISOString() })}
                />
              );
            })}

            {amountOfDaysFill > 0 &&
              Array.from({ length: amountOfDaysFill }).map((_, index) => (
                <View
                  key={index}
                  className="bg-zinc-900 rounded-lg border-2 m-1 border-zinc-700 opacity-40"
                  style={{ width: DAY_SIZE, height: DAY_SIZE }}
                />
              ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}