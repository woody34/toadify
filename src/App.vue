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
      </v-app-bar>
      <v-sheet
        id="scrolling-techniques-3"
        class="overflow-y-auto"
        max-height="100vh"
      >
        <div class="spacer"></div>
        <Home />
      </v-sheet>
    </v-card>
  </v-app>
</template>

<script lang="ts">
import Vue from "vue";
import Home from "@/views/Home.vue";

export default Vue.extend({
  name: "App",

  components: {
    Home
  },

  data: () => ({
    //
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
