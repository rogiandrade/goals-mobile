import { useEffect, useState } from "react";
import { useRoute } from "@react-navigation/native";
import { Alert, ScrollView, Text, View } from "react-native";
import dayjs from "dayjs";
import clsx from "clsx";

import { api } from "../lib/axios";
import { generateProgressPercentage } from "../utils/generateProgressPercentage";

import { BackButton } from "../components/backButton";
import { ProgressBar } from "../components/progressBar";
import { Checkbox } from "../components/checkbox";
import { Loading } from "../components/loading";
import { GoalEmpty } from "../components/goalEmpty";

interface Params {
  date: string;
}

interface DayInfoProps {
  completedGoals: string[];
  possibleGoals: {
    id: string;
    title: string;
  }[];
}

export function Goal() {
  const [loading, setLoading] = useState(true);
  const [dayInfo, setDayInfo] = useState<DayInfoProps | null>(null);
  const [completedGoals, setCompletedGoals] = useState<string[]>([])

  const route = useRoute()
  const { date } = route.params as Params;

  const parsedDate = dayjs(date);
  const isDateInPast = parsedDate.endOf('day').isBefore(new Date());
  const dayOfWeek = parsedDate.format('dddd');
  const dayAndMonth = parsedDate.format('DD/MM');

  const goalsProgress = dayInfo?.possibleGoals?.length ? generateProgressPercentage(dayInfo.possibleGoals.length, completedGoals.length) : 0

  async function fetchGoals() {
    try {
      setLoading(true)

      const response = await api.get('/day', { params: { date } });
      setDayInfo(response.data);
      setCompletedGoals(response.data.completedGoals ?? [])
    } catch (error) {
      console.log(error)
      Alert.alert('Ops', 'Não foi possível carregar as informações das metas.')
    } finally {
      setLoading(false)
    }
  }

  async function handleToggleGoals(goalId: string) {
    try {
      await api.patch(`/goals/${goalId}/toggle`);

      if (completedGoals?.includes(goalId)) {
        setCompletedGoals(prevState => prevState.filter(goal => goal !== goalId));
      } else {
        setCompletedGoals(prevState => [...prevState, goalId]);
      }
    } catch (error) {
      console.log(error)
      Alert.alert('Ops', 'Não foi possível atualizar o status da meta.')
    }
  }

  useEffect(() => {
    fetchGoals()
  }, [])

  if (loading) {
    return (
      <Loading />
    )
  }

  return (
    <View className="flex-1 bg-background px-8 pt-16">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <BackButton />

        <Text className="mt-6 text-zinc-400 font-semibold text-base lowercase">
          {dayOfWeek}
        </Text>

        <Text className="text-white font-extrabold text-3xl">
          {dayAndMonth}
        </Text>

        <ProgressBar progress={goalsProgress} />

        <View className={clsx("mt-6", {
            ['opacity-50']: isDateInPast
          })}>
          {
            dayInfo?.possibleGoals ?
            dayInfo.possibleGoals?.map(goal => (
              <Checkbox 
                key={goal.id}
                title={goal.title}
                checked={completedGoals?.includes(goal.id)}
                onPress={() => handleToggleGoals(goal.id)}
                disabled={isDateInPast}
              />
            ))
            : 
            <GoalEmpty />
          }
        </View>

        {
          isDateInPast && (
            <Text className="text-white mt-10 text-center">
              Você não pode editar metas de uma data passada.
            </Text>
          )
        }
      </ScrollView>
    </View>
  )
}