import { createNativeStackNavigator } from "@react-navigation/native-stack";

const { Navigator, Screen } = createNativeStackNavigator();

import { Home } from "../screens/home";
import { New } from "../screens/new";
import { Goal } from "../screens/goal";

export function AppRoutes() {
  return (
    <Navigator  screenOptions={{ headerShown: false }}>
      <Screen name="home" component={Home} />
      <Screen name="goal" component={Goal} />
      <Screen name="new" component={New} />
    </Navigator>
  );
}