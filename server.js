import fs from "fs";
import path from "path";
import { fileURLToPath } from "node:url";
import express from "express";
import { createServer } from "vite";
import db from "./src/models/index.js";
import cookieParser from "cookie-parser";
import session from "express-session";
import cors from "cors";
import { v4 as uuidv4 } from "uuid";

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
  let opt = {};
  if (env === "production") opt.logging = false;
  let ret = await db.sequelize
    .authenticate()
    .then(async () => {
      await db.sequelize.sync(opt);
      // initDB();
      // db.sequelize.close();
      console.log("Database connection has been established !");
      return true;
    })
    .catch((err) => {
      console.error("Unable to conntect to the database !");
      console.error(err);
      return false;
    });
  if (!ret) return;

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

  var userRouter, serviceRouter, sessionsRouter, actorRouter, orderRouter;
  let prefix = "./";
  // console.log(import("./src/routes/user.route.js")(app));
  if (env === "development") {
    app.use("./", express.static(path.join(__dirname, "src/assets")));
    // app.use('/public-assets', express.static(path.join(__dirname, 'assets')));
  } else {
    prefix = "./dist/prod/client/";
    app.use(
      "./",
      express.static(path.join(__dirname, "./dist/prod/client/src/assets"))
    );
  }
  userRouter = await import(`${prefix}src/routes/user.route.js`);
  serviceRouter = await import(`${prefix}src/routes/service.route.js`);
  sessionsRouter = await import(`${prefix}src/routes/sessions.route.js`);
  actorRouter = await import(`${prefix}src/routes/actor.route.js`);
  orderRouter = await import(`${prefix}src/routes/order.route.js`);
  //  Populate req.cookies
  app.use(cookieParser());
  //  Session setup
  app.use(
    session({
      secret: "myLittleSecret",
      cookie: {
        maxAge: 600000,
        // secure: true,
      },
      saveUninitialized: true,
      resave: false,
      unset: "keep",
    })
  );
  app.use(
    cors({
      origin: [`http://localhost:${port}`, `https://localhost:${port}`],
      credentials: true,
      exposedHeaders: ["set-cookie"],
    })
  );
  // parse requests of content-type - application/x-www-form-urlencoded
  app.use(express.urlencoded({ extended: true }));
  // parse requests of content-type - application/json
  app.use(express.json());
  app.use("/api/users", userRouter.default());
  app.use("/api/services", serviceRouter.default());
  app.use("/api/sessions", sessionsRouter.default());
  app.use("/api/actors", actorRouter.default());
  app.use("/api/orders", orderRouter.default());
  app.get("/api/session", (request, response) => {
    request.session.appSession = uuidv4();
    // console.log(`GET - Session`);
    // console.log(request.session);
    response.send({ id: request.session.appSession });
  });
  app.post("/api/session", (request, response) => {
    // console.log(`POST - Session`);
    // console.log(request.session);
    // console.log(`POST - BODY Session`);
    // console.log(request.body.sessionID);
    if (request.body.sessionID != request.session.appSession) {
      return response
        .status(500)
        .send({ message: "The data in the session does not match!" });
    }
    response.send({ message: "Success!" });
  });
  app.get("*", async (req, res, next) => {
    // console.log("default Get");
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
      // console.log(template);
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

  app.listen(port, () => {
    console.log(`app listening on port ${port}`);
  });
}

// function initDB() {
//   const userType = db.userType;
//   const actorType = db.actorType;
//   const lang = db.langue;
//   const paymentType = db.paymentType;
//   const devise = db.devise;

//   userType.create({
//     regular: true,
//     admin: false,
//   });
//   userType.create({
//     regular: false,
//     admin: true,
//   });
//   userType.create({
//     regular: true,
//     admin: true,
//   });

//   actorType.create({
//     actorTypeId: 2,
//     seller: true,
//     buyer: false,
//   });
//   actorType.create({
//     actorTypeId: 3,
//     seller: false,
//     buyer: true,
//   });
//   actorType.create({
//     actorTypeId: 1,
//     seller: true,
//     buyer: true,
//   });

//   lang.create({
//     libelle: "Français",
//     nom: "fr",
//   });
//   lang.create({
//     libelle: "English",
//     nom: "us",
//   });

//   paymentType.create({
//     cb: true,
//     esp: false,
//     chq: false,
//   });
//   paymentType.create({
//     cb: false,
//     esp: true,
//     chq: false,
//   });
//   paymentType.create({
//     cb: false,
//     esp: false,
//     chq: true,
//   });

//   devise.create({
//     symbole: "€",
//   });
//   devise.create({
//     symbole: "$",
//   });
//   devise.create({
//     symbole: "£",
//   });
// }

createViteServer();
