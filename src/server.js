import buildApp from "./main";
import { renderToString } from "vue/server-renderer";

export default (context) => {
  return new Promise((resolve, reject) => {
    const { app, router } = buildApp();
    renderToString(app);
    // set server-side router's location
    router.push(context.url);

    // wait until router has resolve possible async components hooks
    router.isReady(() => {
      const matchedComponents = router.currentRoute.value.matched;
      // no matched routes, reject with 404
      if (!matchedComponents.length) {
        return reject(new Error("404"));
      }

      // the Promise should resolve to the app instance so it can be rendered
      return resolve({ app, router });
    }, reject);
  });
};
