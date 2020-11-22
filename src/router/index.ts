import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import Page from "@/views/Page.vue";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    name: "Page",
    component: Page
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
