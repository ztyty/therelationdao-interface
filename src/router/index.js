import Vue from "vue";
import VueRouter from "vue-router";
import Index from "../views/index/index";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Index",
    component: Index,
    meta: {
      title: "TheRelationDAO",
    },
  },
  {
    path: "/a/:id",
    name: "AccountDetail",
    component: () => import("@/views/account/detail.vue"),
    meta: {
      title: "Profile",
    },
  },
];

const router = new VueRouter({
//   mode: "history",
  routes,
});

router.beforeEach((to, from, next) => {
  document.title = to.meta.title || "";
  next();
});

export default router;
