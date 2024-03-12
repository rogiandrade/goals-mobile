import { createNativeStackNavigator } from "@react-navigation/native-stack"

const { Navigator, Screen } = createNativeStackNavigator()

import { Home } from "../screens/home"

export function AppRoutes() {
  return(
    <Navigator 
    screenOptions={{headerShown: false}}
    >
      <Screen
      name="home"
      component={ Home } 
      />
    </Navigator>
  )
}