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
const icon = "/favicon.ico";
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
  {
    path: t("actorsLinkTarget", "en"),
    component: "ActorsView",
    name: t("actorsLinkName", "en"),
    auth: true,
  },
  {
    path: t("ordersLinkTarget", "en"),
    component: "OrdersView",
    name: t("ordersLinkName", "en"),
    auth: true,
  },
  {
    path: t("paymentsLinkTarget", "en"),
    component: "PaymentsView",
    name: t("paymentsLinkName", "en"),
    auth: true,
  },
  {
    path: t("invoicesLinkTarget", "en"),
    component: "InvoicesView",
    name: t("invoicesLinkName", "en"),
    auth: true,
  },
  {
    path: t("exportLinkTarget", "en"),
    component: "ExportView",
    name: t("exportLinkName", "en"),
    auth: true,
  },
  {
    path: t("profileLinkTarget", "en"),
    component: "ProfileView",
    name: t("profileLinkName", "en"),
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
        icon: icon,
        requiresAuth: true,
      },
    },
    {
      path: t("homeLinkTarget"),
      name: t("homeLinkName"),
      component: HomeView,
      meta: {
        title: t("homeLinkName"),
        icon: icon,
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
        icon: icon,
        requiresAuth: true,
      },
    },
    {
      path: t("startLinkTarget"),
      name: t("startLinkName"),
      component: () => import("../views/StartView.vue"),
      meta: {
        title: t("startLinkName"),
        icon: icon,
        requiresAuth: false,
      },
    },
    {
      path: t("registerLinkTarget"),
      name: t("registerLinkName"),
      component: () => import("../views/RegisterView.vue"),
      meta: {
        title: t("registerLinkName"),
        icon: icon,
        requiresAuth: false,
      },
    },
    {
      path: t("servicesLinkTarget"),
      name: t("servicesLinkName"),
      component: () => import("../views/ServicesView.vue"),
      meta: {
        title: t("servicesLinkName"),
        icon: icon,
        requiresAuth: false,
      },
    },
    {
      path: t("actorsLinkTarget"),
      name: t("actorsLinkName"),
      component: () => import("../views/ActorsView.vue"),
      meta: {
        title: t("actorsLinkName"),
        icon: icon,
        requiresAuth: false,
      },
    },
    {
      path: t("ordersLinkTarget"),
      name: t("ordersLinkName"),
      component: () => import("../views/OrdersView.vue"),
      meta: {
        title: t("ordersLinkName"),
        icon: icon,
        requiresAuth: false,
      },
    },
    {
      path: t("paymentsLinkTarget"),
      name: t("paymentsLinkName"),
      component: () => import("../views/PaymentsView.vue"),
      meta: {
        title: t("paymentsLinkName"),
        icon: icon,
        requiresAuth: false,
      },
    },
    {
      path: t("invoicesLinkTarget"),
      name: t("invoicesLinkName"),
      component: () => import("../views/InvoicesView.vue"),
      meta: {
        title: t("invoicesLinkName"),
        icon: icon,
        requiresAuth: false,
      },
    },
    {
      path: t("exportLinkTarget"),
      name: t("exportLinkName"),
      component: () => import("../views/ExportView.vue"),
      meta: {
        title: t("exportLinkName"),
        icon: icon,
        requiresAuth: false,
      },
    },
    {
      path: t("profileLinkTarget"),
      name: t("profileLinkName"),
      component: () => import("../views/ProfileView.vue"),
      meta: {
        title: t("profileLinkName"),
        icon: icon,
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
