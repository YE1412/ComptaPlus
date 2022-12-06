import { createApp, createSSRApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import i18n from "@/plugins/i18n";
// Vuetify
import { createVuetify } from "vuetify";
// import type { ThemeDefinition } from "vuetify";
// import * as components from 'vuetify/components'
// import * as directives from 'vuetify/directives'
// Styles
import "./assets/styles.css";
import "./assets/main.css";
import "./assets/style2.css";
import 'vuetify/styles';

const isSSR = import.meta.env.SSR;
// const myCustomLightTheme: ThemeDefinition = {
//   dark: false,
//   colors: {
//     background: '#FFFFFF',
//     surface: '#FFFFFF',
//     primary: "#2196f3",
//     'primary-darken-1': '#3700B3',
//     secondary: "#673ab7",
//     'secondary-darken-1': '#018786',
//     accent: "#9c27b0",
//     error: '#f44336',
//     info: '#3f51b5',
//     success: '#4caf50',
//     warning: '#ff9800',
//   }
// }
const vuetify = createVuetify({
  // theme: {
  //   defaultTheme: "myCustomLightTheme",
  //   themes: {
  //     myCustomLightTheme
  //   },
  // }
  // theme: false,
  // ssr: true,
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
