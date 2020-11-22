<template>
  <v-container>
    <v-row>
      <v-spacer />
      <h3 v-if="track">{{ title }}</h3>
      <v-spacer />
    </v-row>
    <v-row>
      <v-spacer />
      <v-btn
        v-on:click="() => previous()"
        :disabled="disabled"
        fab
        color="#29B46D"
      >
        <v-icon color="white">mdi-skip-previous</v-icon>
      </v-btn>
      <v-btn
        v-if="playing"
        v-on:click="() => pause()"
        :disabled="disabled"
        fab
        color="#29B46D"
      >
        <v-icon color="white">mdi-pause</v-icon>
      </v-btn>
      <v-btn
        v-else
        v-on:click="() => play(track)"
        :disabled="disabled"
        fab
        color="#29B46D"
      >
        <v-icon color="white">mdi-play</v-icon>
      </v-btn>
      <v-btn v-on:click="() => next()" :disabled="disabled" fab color="#29B46D">
        <v-icon color="white">mdi-skip-next</v-icon>
      </v-btn>
      <v-spacer />
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { TrackData } from "@/service/spotify";
import Vue from "vue";
import Component from "vue-class-component";
import { Emit, Prop } from "vue-property-decorator";

@Component({
  name: "playlist"
})
export default class Player extends Vue {
  @Prop(Object) track?: TrackData;
  @Prop(Boolean) playing!: boolean;
  @Emit("previous") previous() {
    return;
  }
  @Emit("play") play(track?: TrackData) {
    return track;
  }
  @Emit("pause") pause() {
    return;
  }
  @Emit("next") next() {
    return;
  }

  get title() {
    if (this.track) {
      const maxLength = 40;
      const shouldShortenTitle =
        this.$vuetify.breakpoint.smAndDown &&
        this.track.title.length > maxLength;
      const shortTitle = shouldShortenTitle
        ? this.track.title.substring(0, maxLength) + "..."
        : this.track.title;
      return shortTitle;
    }
    return "";
  }

  get disabled() {
    return !this.track;
  }
}
</script>
<style scoped></style>
