import fs from "fs";
import path from "path";
import { fileURLToPath } from "node:url";
import express from "express";
import { createServer } from "vite";
import db from "./src/models/index.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const env = process.env.CTX;

console.log(`\n\nEnvironment - ${env}\n`);

var port = env === "development" ? 3000 : null;
port = env === "validate" ? 9000 : port;
port = env === "production" ? 0 : port;
// var corsOptions = {
//   origin: `http://localhost:${port}`,
// };
const app = express();

async function createViteServer() {
  // Testing db connection
  db.sequelize
    .authenticate()
    .then(() => {
      db.sequelize.sync();
      // db.sequelize.close();
      console.log("Database connection has been established !");
    })
    .catch((err) => {
      console.error("Unable to conntect to the database !");
      console.error(err);
    });
  var vite = null;
  if (env === "development") {
    // Create Vite server in middleware mode and configure the app type as
    // 'custom', disabling Vite's own HTML serving logic so parent server
    // can take control
    vite = await createServer({
      server: { middlewareMode: true },
      appType: "custom",
    });

    // use vite's connect instance as middleware
    // if you use own express router (express.Router()), you should
    // use router.use
    app.use(vite.middlewares);
  }

  app.get(/(\/|\/start|\/depart)$/, async (req, res, next) => {
    const url = req.originalUrl;

    try {
      // 1. Read index.html
      var template;
      if (env === "development") {
        template = fs.readFileSync(
          path.resolve(__dirname, "index.html"),
          "utf-8"
        );
      } else if (env === "production") {
        template = fs.readFileSync(
          path.resolve(__dirname, "dist/prod/client/index.html"),
          "utf-8"
        );
      }

      // 3. Load the server entry. vite.ssrLoadModule automatically transforms
      //    your ESM source code to be usable in Node.js! There is no bundling
      //    required, and provides efficient invalidation similar to HMR.
      var render = {};
      if (env === "development") {
        // 3.1. Apply Vite HTML transforms. This injects the Vite HMR client, and
        //    also applies HTML transforms from Vite plugins, e.g. global preambles
        //    from @vitejs/plugin-react
        template = await vite.transformIndexHtml(url, template);
        render = await vite.ssrLoadModule("/src/server.js");
      } else if (env === "production") {
        render = import("./dist/prod/server/server.js");
      }

      // 4. render the app HTML. This assumes entry-server.js's exported `render`
      //    function calls appropriate framework SSR APIs,
      //    e.g. ReactDOMServer.renderToString()
      // const appHtml = await render(url);

      // 5. Inject the app-rendered HTML into the template.
      const html = template.replace(`<!--ssr-outlet-->`, render);

      // 6. Send the rendered HTML back.
      res.status(200).set({ "Content-Type": "text/html" }).end(html);
    } catch (e) {
      // If an error is caught, let Vite fix the stack trace so it maps back to
      // your actual source code.
      if (env === "development") {
        vite.ssrFixStacktrace(e);
      }
      next(e);
    }
  });

  if (env === "production")
    app.use(express.static("./app", "./dist/prod/client"));

  var userRouter;
  // console.log(import("./src/routes/user.route.js")(app));
  if (env === "development") {
    userRouter = await import("./src/routes/user.route.js");
    app.use("./", express.static(path.join(__dirname, "src/assets")));
    // app.use('/public-assets', express.static(path.join(__dirname, 'assets')));
  } else {
    app.use(
      "./",
      express.static(path.join(__dirname, "./dist/prod/client/src/assets"))
    );
  }

  // parse requests of content-type - application/x-www-form-urlencoded
  app.use(express.urlencoded({ extended: true }));
  // parse requests of content-type - application/json
  app.use(express.json());
  app.use("/api/users", userRouter.default());
  app.listen(port, () => {
    console.log(`app listening on port ${port}`);
  });
}

createViteServer();
