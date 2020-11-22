<template>
  <v-container>
    <v-row>
      <v-spacer />
      <v-data-table v-bind="{ headers, items: tracks }">
        <template v-slot:[`item.image`]="{ item }">
          <td>
            <v-card flat class="rounded-0">
              <v-img :src="item.image" class="image">
                <template v-slot:placeholder>
                  <v-img src="../assets/placeholder.jpg" class="image" />
                </template>
                <div class="play-button">
                  <v-btn
                    v-if="playing && matchesCurrentTrack(item)"
                    v-on:click="() => pause()"
                    fab
                    color="black"
                  >
                    <v-icon color="white">mdi-pause</v-icon>
                  </v-btn>
                  <v-btn v-else v-on:click="() => play(item)" fab color="black">
                    <v-icon color="white">mdi-play</v-icon>
                  </v-btn>
                </div>
              </v-img>
            </v-card>
          </td>
        </template>
        <template v-slot:[`item.duration`]="{ item }">
          <td>
            {{ filterDuration(item) }}
          </td>
        </template>
      </v-data-table>
      <v-spacer />
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { TrackData } from "@/service/tracks";
import Vue from "vue";
import Component from "vue-class-component";
import { Emit, Prop } from "vue-property-decorator";
import { headers, filterDuration } from "./util";
@Component({
  name: "playlist",
  data() {
    return {
      headers,
      filterDuration
    };
  }
})
export default class Playlist extends Vue {
  @Prop(Array) tracks!: TrackData[];
  @Prop(Object) track?: TrackData;
  @Prop(Boolean) playing!: boolean;
  @Emit("play") play(track?: TrackData) {
    return track;
  }
  @Emit("pause") pause() {
    return;
  }

  matchesCurrentTrack = (track: TrackData) => {
    return track._id === this.track?._id;
  };
}
</script>
<style scoped>
.image {
  max-width: 15vh;
  max-height: 15vh;
}
.play-button {
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  margin: 4.5vh auto;
  opacity: 0.5;
}
</style>
