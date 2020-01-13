import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  FlatList
} from "react-native";
import {
  fetchForecastAsync,
  DailyForecastResult,
  getForecastEmoji,
  ForecastIcon
} from "../api";
import { black } from "../colors";
import dayjs from "dayjs";

import { NavigationStackProp } from "react-navigation-stack";

type Props = {
  navigation: NavigationStackProp;
};

type ForecastItemProps = {
  time: number;
  summary: string;
  icon: ForecastIcon;
  temperatureHigh: number;
  temperatureHighTime: number;
  temperatureLow: number;
  temperatureLowTime: number;
  navigation: NavigationStackProp;
};

function ForecastItem({
  time,
  summary,
  icon,
  temperatureHigh,
  temperatureLow,
  navigation
}: ForecastItemProps) {
  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("ForecastDetails", {
          time,
          summary,
          icon,
          temperatureHigh,
          temperatureLow
        })
      }
    >
      <View style={styles.weatherIconAndTempRow}>
        <Text style={styles.weatherIcon}>{getForecastEmoji(icon)}</Text>
        <View>
          <Text style={styles.date}>
            {dayjs(new Date(time * 1000)).format("MMMM D, YYYY")}
          </Text>
          <Text style={styles.summary}>{summary.substr(0, 20)}...</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export function DailyForecast({ navigation }: Props) {
  const [dailyForecast, setDailyForecast] = useState<DailyForecastResult>({
    daily: {
      summary: "",
      icon: "clear-day",
      data: []
    }
  });
  const [loading, setLoading] = useState<boolean>(true);

  const getForecast = useCallback(async function getWeather() {
    setLoading(true);
    try {
      const dailyForecastResult = await fetchForecastAsync();

      setLoading(false);
      setDailyForecast(dailyForecastResult);
    } catch (e) {
      setLoading(false);
    }
  }, []);

  useEffect(function didMount() {
    getForecast();
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        keyExtractor={item => `${item.time}`}
        data={dailyForecast.daily.data}
        renderItem={({ item }) => (
          <ForecastItem navigation={navigation} {...item} />
        )}
        onRefresh={getForecast}
        refreshing={loading}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
      <StatusBar barStyle="dark-content" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: black,
    opacity: 0.4
  },
  weatherIcon: {
    fontSize: 64,
    marginRight: 16
  },
  weatherIconAndTempRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 24
  },
  date: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 16
  },
  summary: {
    fontSize: 16
  }
});
