// import { VueLoaderPlugin } from "vue-loader";
// import { DefinePlugin } from "webpack";
import { defineConfig, loadEnv } from "vite";
import path from "path";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import vueI18n from '@intlify/vite-plugin-vue-i18n';
import { fileURLToPath } from "node:url";
import htmlTemplate from 'vite-plugin-html-template';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import vuetify from 'vite-plugin-vuetify';

// console.log(htmlPlugin);
// console.log(`\n\nEnvironnement : - ${process.env.CTX} -\n`);
let config = defineConfig(({ command, mode }) => {
  console.log(`mode - ${mode}`);
  var buildObj = {},
    cssObj = {},
    // serverObj = {},
    pluginsObj = [];
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
        // you need to set i18n resource including paths !
        include: path.resolve(path.dirname(fileURLToPath(import.meta.url)), './src/locales/**'),
      }),
      vuetify(),
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
        // you need to set i18n resource including paths !
        include: path.resolve(path.dirname(fileURLToPath(import.meta.url)), './src/locales/**'),
      }),
      htmlTemplate.default(),
      viteStaticCopy({
        targets: [
          {
            src: 'src/assets/uploads',
            dest: 'assets/'
          }
        ]
      }),
      vuetify(),
      // htmlPlugin({
        // favicon: 'public/favicon.ico',
      //   scripts: [
      //     {
      //       async: true,
      //       src: "src/client.js",
      //       type: "module",
      //     }
      //   ]
      // }),
      // ssr(),
    );
  }
  return {
    define: {},
    mode: mode,
    base: "/dist/",
    publicDir: path.resolve(__dirname, "public/"),
    resolve: {
      alias: {
        "@": path.join(__dirname, "/src"),
        "~": path.join(__dirname, "/node_modules/"),
        "Utilities": path.join(__dirname, "/src/plugins/modules/"),
      },
      extensions: [
        '.mjs', '.ts', '.js', '.jsx', '.tsx', '.json'
      ]
    },
    css: cssObj,
    // server: serverObj,
    build: buildObj,
    plugins: pluginsObj,
    ssr: {
      // SSG Vue-i18n workaround
      noExternal: [/vue-i18n/, /vuetify/, /chart\.js/],
    },
    envDir: path.join(__dirname, "envs"),
    envPrefix: "CLIENT_",
    // root: path.join(__dirname, "src/"),
  };
});

export default config;
