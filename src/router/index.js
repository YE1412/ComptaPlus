import {
  createRouter,
  createWebHistory,
  createMemoryHistory,
} from "vue-router";
import HomeView from "../views/HomeView.vue";
import PdfView from "../views/PdfView.vue";
import i18n from "../plugins/i18n";
import { useUserStore } from "@/stores/user";
import { useSessionStore } from "@/stores/session";
import { useMessageStore } from "@/stores/message";
const { t } = i18n.global;
let router = null;
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
    children: [],
  },
  {
    path: t("registerLinkTarget", "en"),
    component: "RegisterView",
    name: t("registerLinkName", "en"),
    auth: false,
    children: [],
  },
  {
    path: t("homeLinkTarget", "en"),
    component: "HomeView",
    name: t("homeLinkName", "en"),
    auth: true,
    children: [],
  },
  {
    path: t("aboutLinkTarget", "en"),
    component: "AboutView",
    name: t("aboutLinkName", "en"),
    auth: true,
    children: [],
  },
  {
    path: t("actorsLinkTarget", "en"),
    component: "ActorsView",
    name: t("actorsLinkName", "en"),
    auth: true,
    children: [],
  },
  {
    path: t("ordersLinkTarget", "en"),
    component: "OrdersView",
    name: t("ordersLinkName", "en"),
    auth: true,
    children: [],
  },
  {
    path: t("paymentsLinkTarget", "en"),
    component: "PaymentsView",
    name: t("paymentsLinkName", "en"),
    auth: true,
    children: [],
  },
  {
    path: t("invoicesLinkTarget", "en"),
    component: "InvoicesView",
    name: t("invoicesLinkName", "en"),
    auth: true,
    children: [],
  },
  {
    path: t("exportLinkTarget", "en"),
    component: "ExportView",
    name: t("exportLinkName", "en"),
    auth: true,
    children: [
      {
        path: t("pdfViewLinkTarget", "en"),
        component: PdfView,
        name: t("pdfViewLinkName", "en"),
        auth: true,
      },
    ],
  },
  {
    path: t("profileLinkTarget", "en"),
    component: "ProfileView",
    name: t("profileLinkName", "en"),
    auth: true,
    children: [],
  },
  // {
  //   path: t("pdfViewLinkTarget", "en"),
  //   component: "PdfView",
  //   name: t("pdfViewLinkName", "en"),
  //   auth: true,
  // },
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
        requiresAuth: true,
      },
    },
    {
      path: t("actorsLinkTarget"),
      name: t("actorsLinkName"),
      component: () => import("../views/ActorsView.vue"),
      meta: {
        title: t("actorsLinkName"),
        icon: icon,
        requiresAuth: true,
      },
    },
    {
      path: t("ordersLinkTarget"),
      name: t("ordersLinkName"),
      component: () => import("../views/OrdersView.vue"),
      meta: {
        title: t("ordersLinkName"),
        icon: icon,
        requiresAuth: true,
      },
    },
    {
      path: t("paymentsLinkTarget"),
      name: t("paymentsLinkName"),
      component: () => import("../views/PaymentsView.vue"),
      meta: {
        title: t("paymentsLinkName"),
        icon: icon,
        requiresAuth: true,
      },
    },
    {
      path: t("invoicesLinkTarget"),
      name: t("invoicesLinkName"),
      component: () => import("../views/InvoicesView.vue"),
      meta: {
        title: t("invoicesLinkName"),
        icon: icon,
        requiresAuth: true,
      },
    },
    {
      path: t("exportLinkTarget"),
      name: t("exportLinkName"),
      component: () => import("../views/ExportView.vue"),
      meta: {
        title: t("exportLinkName"),
        icon: icon,
        requiresAuth: true,
      },
      children: [
        {
          path: t("pdfViewLinkTarget"),
          name: t("pdfViewLinkName"),
          component: () => import("../views/PdfView.vue"),
          meta: {
            title: t("pdfViewLinkName"),
            icon: icon,
            requiresAuth: true,
          },
        },
      ],
    },
    {
      path: t("profileLinkTarget"),
      name: t("profileLinkName"),
      component: () => import("../views/ProfileView.vue"),
      meta: {
        title: t("profileLinkName"),
        icon: icon,
        requiresAuth: true,
      },
    },
    // {
    //   path: t("pdfViewLinkTarget"),
    //   name: t("pdfViewLinkName"),
    //   component: () => import("../views/PdfView.vue"),
    //   meta: {
    //     title: t("pdfViewLinkName"),
    //     icon: icon,
    //     requiresAuth: true,
    //   },
    // },
  ],
});
router.beforeEach(async (to, from, next) => {
  // ✅ This will work make sure the correct store is used for the
  // current running app
  const userStore = useUserStore();
  const sessionStore = useSessionStore();
  const messageStore = useMessageStore();
  const accessiblePath = isRealPath(to.fullPath);
  let dest = "";
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
  if (to.meta.requiresAuth) {
    dest = await validateSession(sessionStore)
      .then(
        () => {
          // console.log(res);
          return "";
        },
        () => {
          // console.log(rej);
          userStore.resetUser();
          messageStore.deleteMessages();
          return t("startLinkTarget");
        }
      )
      .catch(() => {
        // console.log(err);
        return t("startLinkTarget");
      });
    // console.log(dest);
    dest !== "" ? next(dest) : next();
  } else if (!hasNecessaryRoute(to) && accessiblePath !== null) {
    generateRoute(to, accessiblePath);
    // trigger a redirection
    next(to.fullPath);
  } else next();
});
function validateSession(sessionStore) {
  return sessionStore.validateSession();
}
function isRealPath(to) {
  const ret = null;
  for (const obj of pathsObj) {
    if (to === obj.path) {
      return obj;
    }
  }
  return ret;
}
function hasNecessaryRoute(to) {
  let ret = false;
  ret = router.hasRoute(to.name);
  return ret;
}
function generateRoute(to, pathObj) {
  router.addRoute({
    path: pathObj.path,
    name: pathObj.name,
    // route level code-splitting
    // this generates a separate chunk (About.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(`../views/${pathObj.component}.vue`),
    meta: {
      title: pathObj.name,
      icon: icon,
      requiresAuth: pathObj.auth,
    },
    children: pathObj.children,
  });
}
export default router;
