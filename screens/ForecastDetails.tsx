import React from "react";
import { View, StatusBar, StyleSheet, Text } from "react-native";
import { NavigationStackProp } from "react-navigation-stack";
import dayjs from "dayjs";

import { getForecastEmoji } from "../api";

export function ForecastDetails({
  navigation
}: {
  navigation: NavigationStackProp;
}) {
  const time = navigation.getParam("time");
  const summary = navigation.getParam("summary");
  const icon = navigation.getParam("icon");
  const temperatureHigh = navigation.getParam("temperatureHigh");
  const temperatureLow = navigation.getParam("temperatureLow");

  return (
    <View style={styles.container}>
      <View>
        <View style={styles.weatherIconAndTempRow}>
          <Text style={styles.weatherIcon}>{getForecastEmoji(icon)}</Text>
          <View>
            <Text style={styles.temp}>
              High: {Math.round(temperatureHigh)}°F
            </Text>
            <Text style={styles.temp}>Low: {Math.round(temperatureLow)}°F</Text>
          </View>
        </View>
        <Text style={styles.date}>
          {dayjs(new Date(time * 1000)).format("MMMM D, YYYY")}
        </Text>
        <Text style={styles.summary}>{summary}</Text>
      </View>
      <StatusBar barStyle="dark-content" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 24
  },
  weatherIcon: {
    fontSize: 88,
    marginRight: 24
  },
  temp: {
    fontSize: 31.25,
    fontWeight: "600"
  },
  weatherIconAndTempRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16
  },
  date: {
    fontSize: 25,
    fontWeight: "600",
    marginBottom: 16
  },
  summary: {
    fontSize: 20,
    lineHeight: 25
  }
});
