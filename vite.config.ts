import { fileURLToPath, URL } from "node:url";

import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import path from "path";
import vueI18n from "@intlify/vite-plugin-vue-i18n";
import * as htmlTemplate from "vite-plugin-html-template";
import { viteStaticCopy } from "vite-plugin-static-copy";
import vuetify from "vite-plugin-vuetify";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// console.log(`\n\nEnvironment : - ${process.env.CTX} -\n`);

// https://vitejs.dev/config/
const config = defineConfig(({ command, mode }) => {
  console.log(`mode - ${mode}\n`);
  let [buildObj, cssObj]: object[] = [{}, {}, {}];
  const pluginsObj: any[] = [];
  if (mode === "development") {
    buildObj = {
      outDir: path.resolve(__dirname, "/dist/dev"),
      assetsDir: "assets/app_assets", // Relative to build.outDir
      sourcemap: "inline",
      minify: false,
    };
    // serverObj = {
    //   port: 3000,
    //   strictPort: true,
    //   open: true,
    //   hmr: true,
    // };
    cssObj = {
      devSourcemap: true,
    };
    pluginsObj.push(
      vue({
        include: /\.vue?$/,
        exclude: /node_modules\//,
        isProduction: false,
      }),
      vueJsx(),
      vueI18n({
        compositionOnly: false,
        include: path.resolve(__dirname, "./src/locales/**"),
      }),
      vuetify()
    );
  } else {
    buildObj = {
      outDir: path.resolve(__dirname, "/dist/prod"),
      assetsDir: "assets/app_assets",
      sourcemap: false,
      minify: "terser",
      terserOptions: {},
      target: ["chrome107", "edge107", "safari16.1", "firefox106", "opera91"],
      // Imported or referenced assets that are smaller than this threshold
      // will be inlined as base64 URLs to avoid extra http requests.
      // Set to 0 to disable inlining altogether. (2kb)
      assetsInlineLimit: 2048,
      cssCodeSplit: true,
      // (in kbs)
      chunkSizeWarningLimit: 500,
      // rollupOptions: {
      //   input: {
      //     main: "src/main.ts"
      //   }
      // }
    };
    cssObj = {
      devSourcemap: false,
    };
    pluginsObj.push(
      vue({
        include: /\.vue?$/,
        exclude: /node_modules\//,
        isProduction: true,
      }),
      vueJsx(),
      vueI18n({
        compositionOnly: false,
        include: path.resolve(
          path.dirname(fileURLToPath(import.meta.url)),
          "./src/locales/**"
        ),
      }),
      htmlTemplate.default(),
      viteStaticCopy({
        targets: [
          {
            src: "src/assets/uploads",
            dest: "assets/",
          },
        ],
      }),
      vuetify()
    );
  }
  return {
    define: {},
    mode: mode,
    base: "/dist/",
    publicDir: path.resolve(__dirname, "public/"),
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
        "~": fileURLToPath(new URL("./node_modules", import.meta.url)),
        Utilities: path.join(__dirname, "src/plugins/modules/"),
      },
      extensions: [".mjs", ".ts", ".js", ".jsx", ".tsx", ".json"],
    },
    css: cssObj,
    // server: serverObj,
    build: buildObj,
    plugins: pluginsObj,
    ssr: {
      noExternal: [/vue-i18n/, /vuetify/, /chart\.js/],
    },
    envDir: path.join(__dirname, "envs"),
    envPrifex: "CLIENT_",
  };
});

export default config;
