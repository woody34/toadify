<template>
  <v-app>
    <v-card class="overflow-hidden" flat>
      <v-app-bar
        absolute
        color="#29B46D"
        dark
        shrink-on-scroll
        prominent
        src="./assets/toad-banner-2.jpg"
        fade-img-on-scroll
        scroll-target="#scrolling-techniques-3"
      >
        <template v-slot:img="{ props }">
          <v-img
            v-bind="props"
            gradient="to top right, rgba(56, 233, 142,.7), rgba(28, 121, 73, .7)"
          ></v-img>
        </template>

        <v-toolbar-title>Toadify</v-toolbar-title>

        <v-spacer></v-spacer>

        <v-toolbar-title>
          <v-btn
            v-if="!isConnectedToSpotify"
            color="error"
            v-on="{ click: login }"
            :disabled="isConnectedToSpotify"
            >Connect Spotify</v-btn
          >
        </v-toolbar-title>
      </v-app-bar>
      <v-sheet
        id="scrolling-techniques-3"
        class="overflow-y-auto"
        max-height="100vh"
      >
        <div class="spacer"></div>
        <Home v-if="isConnectedToSpotify" />
      </v-sheet>
    </v-card>
  </v-app>
</template>

<script lang="ts">
import Vue from "vue";
import Home from "@/views/Home.vue";
import { spotifyAuthService } from "./service/spotify";

export default Vue.extend({
  name: "App",
  mounted() {
    this.checkSpotifyConnection();
  },
  methods: {
    async login() {
      const authUrl = (await spotifyAuthService.login()).data;
      window.location = authUrl;
    },
    async checkSpotifyConnection() {
      this.isConnectedToSpotify = (await spotifyAuthService.connected()).data;
    }
  },
  components: {
    Home
  },
  data: () => ({
    isConnectedToSpotify: false
  })
});
</script>
<style scoped>
.spacer {
  height: 130px;
}
.overflow-y-auto {
  overflow-y: auto;
}
</style>
