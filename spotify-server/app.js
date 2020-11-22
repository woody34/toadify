/* eslint-disable @typescript-eslint/no-var-requires */
const spotifyRoutes = require("./spotify.js");
const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors());

const port = 18080;
const host = `http://localhost:${port}`;

app.get("/", (req, res) => {
  res.send("running!");
});

app.use("/api/spotify", spotifyRoutes);

app.listen(port, () => {
  console.log(`Spotify Auth Api Listening at ${host}`);
});
