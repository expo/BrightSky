<p align="center">
  <img alt="screenshots" src="./readme-image.png">
</p>

<h3 align="center" style="font-weight:600">

BrightSky

</h3>

<p align="center">
  Learn how to use Expo with this simple weather app!
</p>

---

<div align="center">

[![supports iOS](https://img.shields.io/badge/iOS-4630EB.svg?style=flat-square&logo=APPLE&labelColor=999999&logoColor=fff)](https://github.com/expo/expo)
[![supports Android](https://img.shields.io/badge/Android-4630EB.svg?style=flat-square&logo=ANDROID&labelColor=A4C639&logoColor=fff)](https://github.com/expo/expo)
[![supports web](https://img.shields.io/badge/web-4630EB.svg?style=flat-square&logo=GOOGLE-CHROME&labelColor=4285F4&logoColor=fff)](https://github.com/expo/expo)

</div>

## Overview

Expo builds apps fast.

This demo will show you how to write a universal app - a single codebase that runs on iOS, Android, and Web. We can do this without downloading any new programs by using our web editor: [snack.expo.io](http://snack.expo.io).

For reference here is the completed project: [https://github.com/expo/BrightSky/](https://github.com/expo/BrightSky/)

### Introducing Expo's web editor - Snack

Start Here: [https://snack.expo.io/@fiberjw/a31e4f](https://snack.expo.io/@fiberjw/a31e4f)

First we add a minimal static template. Notice that our app is instantly rendered. Since `Web` renders the fastest, it is the default when working, but you can click on `iOS` or `Android` tab at any time to see your app on a virtual phone or download the Expo Client on your mobile device for the fastest native development experience possible.

Be sure to save your snack to your profile before putting any significant work into it.

### React hooks, and talking to a 3rd party api.

Source: [https://snack.expo.io/@fiberjw/brightsky-pt.1](https://snack.expo.io/@fiberjw/brightsky-pt.1)

We use react hooks to make our app dynamic. There is a lot of stuff written
about hooks online, but for this snack we are going to only use the two most
common hooks: `useState` and `useEffect`. Let's talk through what is happening
on line 15 to gain an understanding of `useState`:

```jsx
const [currentWeather, setCurrentWeather] = useState({
  currently: {
    summary: "",
    temperature: 0,
    icon: "clear-day"
  }
});
```

We create a new state variable `currentWeather` and a companion function
`setWeather` which allows us to modify `currentWeather` in a way that propagates
throughout the app. The initial value of `currentWeather` is set by the input to
`useState`:

```jsx
{
  currently: {
    summary: '',
    temperature: 0,
    icon: 'clear-day',
  }
}
```

We see the same pattern being used on line 22:

```jsx
const [loading, setLoading] = useState(true);
```

To make sure you are following along, what is the output of the following
expression?

```jsx
{
  loading ? "not ready" : "ready";
}
```

So, let's trace through how our app renders:

```jsx
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
    </View>
  )}
  <StatusBar barStyle="dark-content" />
</View>
```

Since `loading === true` we render the spinning disk:

```jsx
<ActivityIndicator color={purple} size="large" />
```

After the render is complete, the second hook `useEffects` comes into play. `useEffect` allows you to run "effects" after the layout has been rendered. In this case our "effect" is a call to an external api:

```jsx
useEffect(function didMount() {
  getWeather();
}, []);
```

We fetch the `currentWeather` and if successful, we update our state variables
`loading` and `currentWeather`. If we are unsuccessful, we submit an error
message.

```jsx
async function getWeather() {
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
}
```

Setting the state triggers a render. Looking again at line 50:

```jsx
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
    </View>
  )}
  <StatusBar barStyle="dark-content" />
</View>
```

We finally get our weather forecast.

We've abstracted away most of the interaction with the brightsky api in our `api.js` file. We will be around for any questions afterwards, but it's worth highlighting one detail: system permissions. System permissions can be a bit lengthy to set up, but are essential. Using the `expo-permissions` module we eliminate the tedious setup.

### Adding user interaction (button to refetch current weather)

Source: [https://snack.expo.io/@fiberjw/296fce](https://snack.expo.io/@fiberjw/296fce)

Adding our first bit of user interactivity is easy using `TouchableOpacity`

### Screens - creating a navigation config (tabs in stack)

Source: [https://snack.expo.io/@jkhales/65c337](https://snack.expo.io/@jkhales/65c337)

Just like most websites have multiple pages, Apps often make use of multiple different `screens`. Let's refactor our app to see how to do this.

Our first screen will be what we have worked on so far, and our second will be this simple stub:

```jsx
import React from "react";
import { Text } from "react-native";

export function ForecastDetails() {
  return <Text>ForecastDetails</Text>;
}
```

We move both of them into a `screens` folder and stitch them together using the `react-navigation` module. Although you can't tell from the name, this is also produced by Expo and is 'standard' navigator, being used in over 70% of all react-navigation projects.

We stitch the screens together with `createBottomTabNavigator`

Not so bad!
Let's add a bit more style to this by getting a header with `createStackNavigator`:
[https://snack.expo.io/@fiberjw/brightsky-pt.-3](https://snack.expo.io/@fiberjw/brightsky-pt.-3)
You are probably thinking, that's a decent amount of code for a header. But `createStackNavigator` allows us to do more, we will be using it later to `link` to different screens instead of using the somewhat constrained bottom navigator.

### Linking to another screen

Source: [https://snack.expo.io/@fiberjw/14c60b](https://snack.expo.io/@fiberjw/14c60b)

Let's add a third screen, `DailyForecast`.

DailyForecast is in basically a `FlatList` of `TouchableOpacity`. These are
handy components worth getting comfortable with. For example, you could hack
together a instagram feed with them.

The `ForecastItem`(TouchableOpacity), has a display similar to what we did with the `CurrentWeather` screen. It also introduces us to `Linking:`

```jsx
onPress={() =>
  navigation.navigate("ForecastDetails", {
    time,
    summary,
    icon,
    temperatureHigh,
    temperatureLow,
  })
}
```

The flat list is basically a glorified for loop that optimizes your lists to prevent memory issues that actually using a for loop/ array map would cause:

```jsx
<FlatList
  keyExtractor={item => `${item.time}`}
  data={dailyForecast.daily.data}
  renderItem={({ item }) => <ForecastItem navigation={navigation} {...item} />}
  onRefresh={getForecast}
  refreshing={loading}
  ItemSeparatorComponent={() => <View style={styles.separator} />}
/>
```

## API Server

The BrightSky API server code lives in
[`./brightsky-api`](https://github.com/expo/BrightSky/tree/master/brightsky-api)
and is deployed on [ZEIT Now](https://now.sh).
