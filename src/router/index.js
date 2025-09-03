import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import CityView from "../views/CityView.vue";
import RadarView from "../views/RadarView.vue";

export default createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/city/:lat,:lon",
      name: "city",
      component: CityView,
      props: (route) => ({
        lat: parseFloat(route.params.lat),
        lon: parseFloat(route.params.lon),
        name: route.query.name || "Location",
      }),
    },
    {
      path: "/radar",
      name: "radar",
      component: RadarView,
    },
  ],
});
