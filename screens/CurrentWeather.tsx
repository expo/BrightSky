import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  StatusBar,
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity
} from "react-native";
import dayjs from "dayjs";

import {
  fetchCurrentWeatherAsync,
  CurrentWeatherResult,
  getForecastEmoji
} from "../api";
import { purple } from "../colors";

export function CurrentWeather() {
  const [currentWeather, setCurrentWeather] = useState<CurrentWeatherResult>({
    currently: {
      summary: "",
      temperature: 0,
      icon: "clear-day"
    }
  });
  const [loading, setLoading] = useState<boolean>(true);

  const getWeather = useCallback(async function getWeather() {
    setLoading(true);
    try {
      const currentWeather = await fetchCurrentWeatherAsync();

      setLoading(false);
      setCurrentWeather(currentWeather);
    } catch (e) {
      console.error(e);
      setLoading(false);
      setCurrentWeather({
        currently: {
          summary:
            "Weather request failed. Please use the button below to try again.",
          temperature: 0,
          icon: "error"
        }
      });
    }
  }, []);

  useEffect(function didMount() {
    getWeather();
  }, []);

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator color={purple} size="large" />
      ) : (
        <View>
          <View style={styles.weatherIconAndTempRow}>
            <Text style={styles.weatherIcon}>
              {getForecastEmoji(currentWeather.currently.icon)}
            </Text>
            <Text style={styles.temp}>
              {Math.round(currentWeather.currently.temperature)}°F
            </Text>
          </View>
          <Text style={styles.date}>
            {dayjs(Date.now()).format("MMMM D, YYYY")}
          </Text>
          <Text style={styles.summary}>{currentWeather.currently.summary}</Text>
          <TouchableOpacity
            style={styles.checkButtonContainer}
            onPress={getWeather}
          >
            <Text style={styles.checkButtonLabel}>Check current weather</Text>
          </TouchableOpacity>
        </View>
      )}
      <StatusBar barStyle="dark-content" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-around",
    alignItems: "center",
    padding: 24
  },
  weatherIcon: {
    fontSize: 88,
    marginRight: 24
  },
  temp: {
    fontSize: 61.04,
    fontWeight: "bold"
  },
  weatherIconAndTempRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8
  },
  date: {
    fontSize: 25,
    fontWeight: "600",
    marginBottom: 16
  },
  summary: {
    fontSize: 20,
    lineHeight: 25,
    marginBottom: 24
  },
  checkButtonContainer: {
    backgroundColor: purple,
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    justifyContent: "center"
  },
  checkButtonLabel: { color: "white", fontSize: 16, fontWeight: "500" }
});
