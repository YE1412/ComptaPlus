import { fileURLToPath, URL } from "node:url";

import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import path from "path";

console.log(`\n\nEnvironment : - ${process.env.CTX} -\n`);

// https://vitejs.dev/config/
const config = defineConfig(({ command, mode }) => {
  console.log(`mode - ${mode}\n`);
  let [buildObj, cssObj, serverObj]: object[] = [{}, {}, {}];
  const pluginsObj: any[] = [];
  if (mode === "development") {
    buildObj = {
      outDir: path.resolve(__dirname, "/dist/dev"),
      assetsDir: "assets/app_assets", // Relative to build.outDir
      sourcemap: "inline",
      minify: false,
    };
    serverObj = {
      port: 3000,
      strictPort: true,
      open: true,
      hmr: true,
    };
    cssObj = {
      devSourcemap: true,
    };
    pluginsObj.push(
      vue({
        include: /\.vue?$/,
        exclude: /node_modules\//,
        isProduction: false,
      }),
      vueJsx()
    );
  } else {
    buildObj = {
      // outDir: path.resolve(__dirname, "/dist/prod"),
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
      rollupOptions: {
        input: {
          main: "src/main.ts"
        }
      }
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
      vueJsx()
    );
  }
  return {
    define: {},
    base: "/dist/",
    publicDir: path.resolve(__dirname, "public/"),
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
        "~": fileURLToPath(new URL("./node_modules", import.meta.url)),
      },
      extensions: [".mjs", ".ts", ".js", ".jsx", ".tsx", ".json"],
    },
    css: cssObj,
    server: serverObj,
    build: buildObj,
    plugins: pluginsObj,
  };
});

export default config;
