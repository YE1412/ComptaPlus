import {
  createRouter,
  createWebHistory,
  createMemoryHistory,
} from "vue-router";
import HomeView from "../views/HomeView.vue";
import i18n from "../plugins/i18n";
import { useUserStore } from "@/stores/user";

const { t } = i18n.global;
let router: any = null;
const isServer = typeof window === "undefined";
const history = isServer
  ? createMemoryHistory()
  : createWebHistory(import.meta.env.BASE_URL);

const pathsObj = [
  {
    path: t("startLinkTarget", "en"),
    component: "StartView",
    name: t("startLinkName", "en"),
    auth: false,
  },
  {
    path: t("registerLinkTarget", "en"),
    component: "RegisterView",
    name: t("registerLinkName", "en"),
    auth: false,
  },
  {
    path: t("homeLinkTarget", "en"),
    component: "HomeView",
    name: t("homeLinkName", "en"),
    auth: true,
  },
  {
    path: t("aboutLinkTarget", "en"),
    component: "AboutView",
    name: t("aboutLinkName", "en"),
    auth: true,
  },
];

router = createRouter({
  history,
  routes: [
    {
      path: "/",
      name: "h",
      component: HomeView,
      meta: {
        title: t("homeLinkName"),
        icon: "/favicon.ico",
        requiresAuth: true,
      },
    },
    {
      path: t("homeLinkTarget"),
      name: t("homeLinkName"),
      component: HomeView,
      meta: {
        title: t("homeLinkName"),
        icon: "/favicon.ico",
        requiresAuth: true,
      },
    },
    {
      path: t("aboutLinkTarget"),
      name: t("aboutLinkName"),
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import("../views/AboutView.vue"),
      meta: {
        title: t("aboutLinkName"),
        icon: "/favicon.ico",
        requiresAuth: true,
      },
    },
    {
      path: t("startLinkTarget"),
      name: t("startLinkName"),
      component: () => import("../views/StartView.vue"),
      meta: {
        title: t("startLinkName"),
        icon: "/favicon.ico",
        requiresAuth: false,
      },
    },
    {
      path: t("registerLinkTarget"),
      name: t("registerLinkName"),
      component: () => import("../views/RegisterView.vue"),
      meta: {
        title: t("registerLinkName"),
        icon: "/favicon.ico",
        requiresAuth: false,
      },
    },
  ],
});

router.beforeEach((to: any, from: any, next: any) => {
  // ✅ This will work make sure the correct store is used for the
  // current running app
  const userStore = useUserStore();
  const accessiblePath = isRealPath(to.fullPath);
  // console.log(`-----------------------\nto`);
  // console.log(to);
  // console.log(`userStore connected ?`);
  // console.log(userStore.connected);
  // console.log(`startLinkTarget`);
  // console.log(t("startLinkTarget"));
  // console.log(`Router getRoutes`);
  // console.log(router.getRoutes());
  // console.log(`Accessible Path`);
  // console.log(accessiblePath);
  // console.log(`Paths Obj`);
  // console.log(pathsObj);
  // console.log(`-----------------------\n`);
  if (to.meta.requiresAuth && !userStore.connected) next(t("startLinkTarget"));
  else if (!hasNecessaryRoute(to) && accessiblePath !== null) {
    generateRoute(to, accessiblePath);
    // trigger a redirection
    next(to.fullPath);
  } else next();
});

function isRealPath(to: string) {
  const ret = null;
  for (const obj of pathsObj) {
    if (to === obj.path) {
      return obj;
    }
  }
  return ret;
}

function hasNecessaryRoute(to: any): boolean {
  let ret = false;
  ret = router.hasRoute(to.name);
  return ret;
}

function generateRoute(to: any, pathObj: any): void {
  router.addRoute({
    path: pathObj.path,
    name: pathObj.name,
    // route level code-splitting
    // this generates a separate chunk (About.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(`../views/${pathObj.component}.vue`),
    meta: {
      title: pathObj.name,
      icon: "/favicon.ico",
      requiresAuth: pathObj.auth,
    },
  });
}

export default router;
