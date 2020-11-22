import { TrackData } from "@/service/spotify";
import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules: {}
});
export interface PlayerState {
  tracks: TrackData[];
  track?: TrackData;
  playing: boolean;
}
