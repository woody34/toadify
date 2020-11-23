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
import { TrackData } from "@/service/spotify";
import { spotifyPlayerService } from "@/service/spotify";
import { PlayerState } from "@/store";

@Component({
  components: {
    Playlist,
    Player
  },
  data() {
    return {
      key1: "value-1",
      key2: "value-2"
    };
  }
})
export default class Page extends Vue {
  mounted() {
    console.log(this);
    this.loadPlayerState();
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

  // Actions
  async loadPlayerState() {
    const state: PlayerState = (await spotifyPlayerService.state()).data;
    this.state = state;
  }

  async play(track?: TrackData) {
    if (track) {
      await spotifyPlayerService.play(track.uri);
      await this.loadPlayerState();
    } else {
      this.pause();
    }
  }

  async pause() {
    await spotifyPlayerService.pause();
    this.loadPlayerState();
  }

  async next() {
    if (!this.track) {
      return;
    }
    const [oldTrack] = this.tracks.filter(
      track => track._id === this.track?._id
    );
    const newTrackIndex = this.tracks.indexOf(oldTrack) + 1;
    const newTrack = this.tracks[newTrackIndex];
    if (newTrack) {
      await this.play(newTrack);
    }
  }

  async previous() {
    if (!this.track) {
      return;
    }
    const [oldTrack] = this.tracks.filter(
      track => track._id === this.track?._id
    );
    const newTrackIndex = this.tracks.indexOf(oldTrack) - 1;
    const newTrack = this.tracks[newTrackIndex];
    if (newTrack) {
      await this.play(newTrack);
    }
  }
}
</script>
