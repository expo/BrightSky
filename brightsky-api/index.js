const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");
const app = express();
const port = 3000;

app.use(cors());

// Generate your own API Key from https://darksky.net/dev
const API_KEY = "378a09428c0dd21b3961956441c89314";

function checkQueryVariables(query, res) {
  const { latitude, longitude } = query;
  if (!latitude || !longitude)
    res
      .status(400)
      .send("please supply latitude and longitude. /?latitude=X&longitude=Y");
}

app.get("/", async (_, res) => {
  res.send(
    "Welcome to the BrightSky API! Use /current?latitude=X&longitude=Y or /forecast?latitude=X&longitude=Y to get what you need :)"
  );
});

app.get("/current", async ({ query }, res) => {
  checkQueryVariables(query, res);

  const darkSkyReponse = await (
    await fetch(
      `https://api.darksky.net/forecast/${API_KEY}/${query.latitude},${query.longitude}/?exclude=daily,minutely,hourly,flags`
    )
  ).json();

  res.json(darkSkyReponse);
});

app.get("/forecast", async ({ query }, res) => {
  checkQueryVariables(query, res);

  const darkSkyReponse = await (
    await fetch(
      `https://api.darksky.net/forecast/${API_KEY}/${query.latitude},${query.longitude}/?exclude=currently,minutely,hourly,flags`
    )
  ).json();

  res.json(darkSkyReponse);
});

app.listen(port, () => console.log(`BrightSky API listening on port ${port}!`));
