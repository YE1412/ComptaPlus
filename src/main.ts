import { createApp, createSSRApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import i18n from "@/plugins/i18n";
// Vuetify
import { createVuetify } from "vuetify";
// Styles
import "./assets/styles.css";
import "./assets/main.css";
import "./assets/style2.css";

const isSSR = typeof window === "undefined";
const vuetify = createVuetify({
  // components,
  // directives,
});

// app.mount("#app");
export default function buildApp() {
  const app = isSSR ? createSSRApp(App) : createApp(App);

  app.use(createPinia());
  app.use(router);
  app.use(vuetify);
  app.use(i18n);

  return { app, router };
}
