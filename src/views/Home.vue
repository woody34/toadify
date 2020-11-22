<template>
  <div>
    <player
      v-bind="{ tracks, track, playing }"
      v-on="{ previous, play, pause, next }"
    />
    <playlist
      v-if="tracks"
      v-bind="{ tracks, track, playing }"
      v-on="{ play, pause }"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Playlist from "@/components/Playlist.vue";
import Player from "@/components/Player.vue";
import { mockTrack, TrackData } from "@/service/tracks";

interface PlayerState {
  tracks: TrackData[];
  track?: TrackData;
  playing: boolean;
}

@Component({
  components: {
    Playlist,
    Player
  }
})
export default class Home extends Vue {
  // Lifecycle Hook
  mounted() {
    this.loadTracks();
  }

  // State
  state: PlayerState = {
    tracks: [] as TrackData[],
    track: undefined,
    playing: false
  };

  // Getters
  get tracks() {
    return this.state.tracks;
  }

  get track() {
    return this.state.track;
  }

  get playing() {
    return this.state.playing;
  }

  // Mutations
  setTracks(tracks: TrackData[]) {
    this.state.tracks = tracks;
  }

  setTrack(track?: TrackData) {
    this.state.track = track;
  }

  setPlaying(playing: boolean) {
    this.state.playing = playing;
  }

  // Actions
  loadTracks() {
    const tracks = Array(50)
      .fill(0)
      .map(mockTrack);
    this.setTracks(tracks);
  }

  play(track?: TrackData) {
    this.setTrack(track);
    this.setPlaying(Boolean(track));
  }

  pause() {
    this.setPlaying(false);
  }

  next() {
    if (!this.track) {
      return;
    }
    const newTrackIndex = this.tracks.indexOf(this.track) + 1;
    const newTrack = this.tracks[newTrackIndex];
    if (newTrack) {
      this.setTrack(newTrack);
      this.setPlaying(Boolean(newTrack));
    }
  }

  previous() {
    if (!this.track) {
      return;
    }
    const newTrackIndex = this.tracks.indexOf(this.track) - 1;
    const newTrack = this.tracks[newTrackIndex];
    if (newTrack) {
      this.setTrack(newTrack);
      this.setPlaying(Boolean(newTrack));
    }
  }
}
</script>
