import React from "react";
import { createAppContainer } from "react-navigation";
import {
  createStackNavigator,
  NavigationStackProp
} from "react-navigation-stack";
import {
  createBottomTabNavigator,
  NavigationTabProp
} from "react-navigation-tabs";
import dayjs from "dayjs";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { CurrentWeather } from "./screens/CurrentWeather";
import { DailyForecast } from "./screens/DailyForecast";
import { ForecastDetails } from "./screens/ForecastDetails";
import { purple, darkGray } from "./colors";

const MainTabNavigator = createBottomTabNavigator(
  {
    CurrentWeather,
    DailyForecast
  },
  {
    initialRouteName: "CurrentWeather",
    defaultNavigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused }) => {
        const { routeName } = navigation.state;

        let iconName;
        const color = focused ? purple : darkGray;
        if (routeName === "CurrentWeather") {
          iconName = focused ? "star" : "star-outline";
        } else if (routeName === "DailyForecast") {
          iconName = focused ? "clock" : "clock-outline";
        }

        return (
          <MaterialCommunityIcons name={iconName} color={color} size={24} />
        );
      }
    }),
    tabBarOptions: {
      showLabel: false,
      activeTintColor: purple,
      inactiveTintColor: darkGray
    }
  }
);

MainTabNavigator.navigationOptions = ({
  navigation
}: {
  navigation: NavigationTabProp;
}) => {
  const { routeName } = navigation.state.routes[navigation.state.index];

  // You can do whatever you like here to pick the title based on the route name
  let headerTitle;
  if (routeName === "CurrentWeather") {
    headerTitle = "Current Weather";
  } else if (routeName === "DailyForecast") {
    headerTitle = "Next Week's Forecast";
  }

  return {
    headerTitle
  };
};

const AppNavigator = createStackNavigator(
  {
    MainTabNavigator,
    ForecastDetails: {
      screen: ForecastDetails,
      navigationOptions: ({
        navigation
      }: {
        navigation: NavigationStackProp;
      }) => ({
        // generate dynamic screen title based on screen's params
        title: dayjs(
          new Date((navigation.state.params || { time: 0 }).time * 1000)
        ).format("MMMM D, YYYY")
      })
    }
  },
  {
    initialRouteName: "MainTabNavigator",
    defaultNavigationOptions: {
      headerTitleStyle: {
        color: purple
      },
      headerBackTitleStyle: {
        color: purple
      },
      headerTintColor: purple
    }
  }
);

export default createAppContainer(AppNavigator);
