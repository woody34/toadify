import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import "roboto-fontface/css/roboto/roboto-fontface.css";
import "@mdi/font/css/materialdesignicons.css";
import Spotify from "spotify-web-api-node";
// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
//@ts-ignore
import VueSpotify from "vue-spotify";

Vue.config.productionTip = false;
Vue.use(VueSpotify, new Spotify());

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount("#app");
