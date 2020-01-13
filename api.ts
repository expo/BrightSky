import * as Location from "expo-location";
import * as Permissions from "expo-permissions";
import { Alert, Platform } from "react-native";

type ConfirmOptions = {
  title: string;
  message: string;
  dismissButtonLabel?: string;
  confirmButtonLabel?: string;
};

function confirmAsync({
  title,
  message,
  dismissButtonLabel,
  confirmButtonLabel,
}: ConfirmOptions) {
  if (Platform.OS === "web") {
    return Promise.resolve(confirm(message));
  }

  return new Promise<boolean>((resolve, _reject) => {
    Alert.alert(
      title,
      message,
      [
        {
          text: dismissButtonLabel || "Cancel",
          style: "cancel",
          onPress: () => resolve(false),
        },
        { text: confirmButtonLabel || "OK", onPress: () => resolve(true) },
      ],
      { cancelable: false },
    );
  });
}

async function askForPermissions() {
  let permissionCheckResponse = await Permissions.getAsync(
    Permissions.LOCATION,
  );

  if (permissionCheckResponse.status === "granted") return true;

  if (
    !(await confirmAsync({
      title: "Requesting Location Permissions",
      message:
        "BrightSky needs access to your location for accurate weather reporting.",
      dismissButtonLabel: "Don't Allow",
      confirmButtonLabel: "Allow",
    }))
  ) {
    return false; // return early to guard against being denied permissions on iOS
  }

  let permissionRequestResponse = await Permissions.askAsync(
    Permissions.LOCATION,
  );

  if (permissionRequestResponse.status === "granted") {
    return true;
  }
  return false;
}

export type ForecastIcon =
  | "clear-day"
  | "clear-night"
  | "rain"
  | "snow"
  | "sleet"
  | "wind"
  | "fog"
  | "cloudy"
  | "error"
  | "partly-cloudy-day"
  | "partly-cloudy-night";

export type CurrentWeatherResult = {
  currently: {
    summary: string;
    temperature: number;
    icon: ForecastIcon;
  };
};

export type DailyForecastResult = {
  daily: {
    summary: string;
    icon: ForecastIcon;
    data: {
      time: number;
      summary: string;
      icon: ForecastIcon;
      temperatureHigh: number;
      temperatureHighTime: number;
      temperatureLow: number;
      temperatureLowTime: number;
    }[];
  };
};

export function getForecastEmoji(iconName: ForecastIcon) {
  switch (iconName) {
    case "clear-day":
      return "☀️";
    case "clear-night":
      return "🌜";
    case "rain":
      return "🌧";
    case "snow":
      return "❄️";
    case "sleet":
      return "⛸";
    case "wind":
      return "💨";
    case "fog":
      return "🌫";
    case "cloudy":
      return "☁️";
    case "partly-cloudy-day":
      return "🌤";
    case "partly-cloudy-night":
      return "🌥";
    case "error":
      return "😢";
    default:
      return "🌤";
  }
}

export async function fetchCurrentWeatherAsync(): Promise<
  CurrentWeatherResult
> {
  // check for location permissions
  const hasPermissons = await askForPermissions();
  if (!hasPermissons) throw new Error("Location permission not granted");

  // get lat/lon
  const {
    coords: { longitude, latitude },
  } = await Location.getCurrentPositionAsync();

  return await (
    await fetch(
      `https://brightsky-api.fiberjw.now.sh/current/?latitude=${latitude}&longitude=${longitude}`,
    )
  ).json();
}

export async function fetchForecastAsync(): Promise<DailyForecastResult> {
  // check for location permissions
  const hasPermissons = await askForPermissions();
  if (!hasPermissons) throw new Error("Location permission not granted");

  // get lat/lon
  const {
    coords: { longitude, latitude },
  } = await Location.getCurrentPositionAsync();

  return await (
    await fetch(
      `https://brightsky-api.fiberjw.now.sh/forecast/?latitude=${latitude}&longitude=${longitude}`,
    )
  ).json();
}
