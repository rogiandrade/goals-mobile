import { ActivityIndicator, View } from "react-native";

export function Loading() {
  return(
    <View className="flex-1 justify-center items-center bg-background">
      <ActivityIndicator size="large" color="#7C3AED" />
    </View>
  )
}