import buildApp from "./main";

const { app, router } = buildApp();

router.isReady().then(() => {
  app.mount("#app", true);
});
