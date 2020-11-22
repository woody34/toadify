/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable @typescript-eslint/no-var-requires */
const express = require("express");
const router = express.Router();
const { BAD_REQUEST, OK } = require("http-status-codes");

const SpotifyWebApi = require("spotify-web-api-node");
const clientHost = "http://localhost:8080";
const scopes = [
  "playlist-modify-public",
  "playlist-modify-private",
  "playlist-read-private",
  "playlist-read-collaborative",
  "app-remote-control",
  "streaming",
  "user-read-private",
  "user-read-email",
  "user-read-playback-state",
  "user-modify-playback-state",
  "user-read-currently-playing",
  "user-read-playback-state"
];
const { spotifyTrackToTrackData } = require("./util");

require("dotenv").config();

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_API_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: process.env.CALLBACK_URL
});

router.get("/login", (req, res) => {
  const url = spotifyApi.createAuthorizeURL(scopes);
  res.json(url + "&show_dialog=true");
});

router.get("/connected", (req, res) => {
  const hasToken = spotifyApi.getAccessToken();
  res.json(Boolean(hasToken));
});

router.get("/callback", async (req, res) => {
  const { code } = req.query;
  try {
    const resp = await spotifyApi.authorizationCodeGrant(code);
    const { access_token, refresh_token } = resp.body;
    spotifyApi.setAccessToken(access_token);
    spotifyApi.setRefreshToken(refresh_token);

    res.redirect(clientHost);
  } catch (e) {
    console.error(e);
  }
});

const playerRouter = express.Router();

playerRouter.get("/state", async (req, res) => {
  try {
    // tracks
    const playlistId = "2RS2LIA8oyHAwDJ4cyeuBf";
    const spotifyTracks = (await spotifyApi.getPlaylistTracks(playlistId)).body;
    const tracks = spotifyTracks.items.map(spotifyTrackToTrackData);
    const tracksWithUsers = [];
    for (const track of tracks) {
      track.addedBy = (
        await spotifyApi.getUser(track.addedBy)
      ).body.display_name;
      tracksWithUsers.push(track);
    }

    // player state
    const spotifyState = (await spotifyApi.getMyCurrentPlaybackState()).body;
    const track = tracksWithUsers.find(
      track => track.uri === spotifyState.item.album.uri
    );
    const state = {
      playing: spotifyState.is_playing,
      trackUri: spotifyState.item.album.uri,
      track,
      tracks: tracksWithUsers
    };

    // connected
    const isConnect = await spotifyApi.getAccessToken();

    if (!isConnect) {
      res.redirect("http://localhost:8080");
    }

    res.status(OK).json(state);
  } catch (e) {
    console.error(e);
    res.status(BAD_REQUEST);
  }
});

playerRouter.get("/play/:uri", async (req, res) => {
  const { uri } = req.params;
  try {
    const state = await spotifyApi.getMyDevices();
    const [device] = state.body.devices;
    await spotifyApi.play({ context_uri: uri, device_id: device.id });
    res.status(OK).json();
  } catch (e) {
    console.error(e);
    res.status(BAD_REQUEST);
  }
});

playerRouter.get("/pause", async (req, res) => {
  try {
    const state = await spotifyApi.getMyDevices();
    const [device] = state.body.devices;
    await spotifyApi.pause({ device_id: device.id });
    res.status(OK).json();
  } catch (e) {
    console.error(e);
    res.status(BAD_REQUEST);
  }
});

router.use("/player", playerRouter);

module.exports = router;
