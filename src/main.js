import Vue from "vue";
import VueRouter from "vue-router";
import App from "./App.vue";
import HomePage from "@/pages/HomePage";
import "@/assets/index.css";

Vue.config.productionTip = false;

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Dashboard",
    component: HomePage,
  },
];
const router = new VueRouter({
  linkExactActiveClass: "is-active",
  mode: "history",
  base: "/",
  routes,
});

new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
