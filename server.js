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
import * as dotenv from 'dotenv';
// import { createSsrServer } from 'vite-ssr/dev';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const env = process.env.CTX;

console.log(`\n\nEnvironment - ${env}\n`);

dotenv.config({ path: path.join(__dirname, 'envs/.env') });

// console.log(process.env);
var port = env === "development" ? process.env.CLIENT_DEV_PORT : null;
port = env === "validate" ? process.env.CLIENT_PROD_PORT : port;
port = env === "production" ? process.env.CLIENT_PROD_PORT : port;
// var corsOptions = {
//   origin: `http://localhost:${port}`,
// };
const app = express();

async function createViteServer() {
  const resolve = (p) => path.resolve(__dirname, p);
  const manifest = env === "production"
    ? JSON.parse(fs.readFileSync(resolve('dist/prod/client/ssr-manifest.json'), 'utf-8'))
    : {}
  // Testing db connection
  let opt = {force:true};
  if (env === "production") opt.logging = false;
  let ret = await db.sequelize
    .authenticate()
    .then(async () => {
      await db.sequelize
        .query("SET FOREIGN_KEY_CHECKS = 0", { raw: true })
        .then(async () => {
          await db.sequelize.sync(opt);
          initDB();
        });
      console.log("Database connection has been established !");
      return true;
    })
    .catch((err) => {
      console.error("Unable to conntect to the database !");
      console.error(err);
      return false;
    });
  if (!ret) return;

  var vite = null, prefixRoute = "./", prefixMiddleware = "";
  var userRouter,
    serviceRouter,
    sessionsRouter,
    actorRouter,
    orderRouter,
    paymentRouter,
    invoiceRouter;
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
  }else{
    prefixMiddleware = "/dist";
  }
  userRouter = await import(`${prefixRoute}src/routes/user.route.js`);
  serviceRouter = await import(`${prefixRoute}src/routes/service.route.js`);
  sessionsRouter = await import(`${prefixRoute}src/routes/sessions.route.js`);
  actorRouter = await import(`${prefixRoute}src/routes/actor.route.js`);
  orderRouter = await import(`${prefixRoute}src/routes/order.route.js`);
  paymentRouter = await import(`${prefixRoute}src/routes/payment.route.js`);
  invoiceRouter = await import(`${prefixRoute}src/routes/invoice.route.js`);
  
  app.use(`${prefixMiddleware}/api/users`, userRouter.default());
  app.use(`${prefixMiddleware}/api/services`, serviceRouter.default());
  app.use(`${prefixMiddleware}/api/sessions`, sessionsRouter.default());
  app.use(`${prefixMiddleware}/api/actors`, actorRouter.default());
  app.use(`${prefixMiddleware}/api/orders`, orderRouter.default());
  app.use(`${prefixMiddleware}/api/payments`, paymentRouter.default());
  app.use(`${prefixMiddleware}/api/invoices`, invoiceRouter.default());
  app.get(`${prefixMiddleware}/api/session`, (request, response) => {
    request.session.appSession = uuidv4();
    response.send({ id: request.session.appSession });
  });
  app.post(`${prefixMiddleware}/api/session`, (request, response) => {
    if (request.body.sessionID != request.session.appSession) {
      return response
        .status(500)
        .send({ message: "The data in the session does not match!" });
    }
    response.send({ message: "Success!" });
  });
  if (env === "production") {
    // app.use("/dist", express.static(resolve("/dist/prod/client")));
    const mid = await import('sirv');
    app.use(
      '/dist',
      mid.default(resolve('dist/prod/client'), {
        maxAge: 31536000, // 1Y
        immutable: false
      })
    );
  } else {
    app.use(
      "/",
      express.static(path.join(__dirname, "src"))
    );
  }
  app.get("*", async (req, res, next) => {
    // console.log("default Get");
    // console.log(__dirname);
    const url = req.originalUrl;
    // console.log("URL");
    // console.log(url);
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
      var render = "";
      if (env === "development") {
        // 3.1. Apply Vite HTML transforms. This injects the Vite HMR client, and
        //    also applies HTML transforms from Vite plugins, e.g. global preambles
        //    from @vitejs/plugin-react
        // console.log("Template Before");
        // console.log(template);
        template = await vite.transformIndexHtml(url, template);
        // console.log("Template");
        // console.log(template);
        render = await vite.ssrLoadModule("./src/server.js", { fixStacktrace: true });
        // console.log("Render");
        // console.log(render);
      } else if (env === "production") {
        render = await import("./dist/prod/server/server.js");
        // console.log("Render");
        // console.log(render);
      }

      // 4. render the app HTML. This assumes entry-server.js's exported `render`
      //    function calls appropriate framework SSR APIs,
      //    e.g. ReactDOMServer.renderToString()
      // console.log("Manifest");
      // console.log(manifest);
      const [appHtml, preloadLinks] = await render.default(url, manifest);
      // console.log("App HTML");
      // console.log(appHtml);
      // console.log("Preload Links");
      // console.log(preloadLinks);
      // console.log(template);
      // 5. Inject the app-rendered HTML into the template.
      const html = template
        .replace(`<!--preload-links-->`, preloadLinks)
        .replace(`<!--ssr-outlet-->`, appHtml);

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

  app.listen(port, () => {
    console.log(`app listening on port ${port}`);
  });
}

function initDB() {
  const userType = db.userType;
  const actorType = db.actorType;
  const lang = db.langue;
  const paymentType = db.paymentType;
  const devise = db.devise;
  const price = db.price;

  price.create({
    stockPricesId: 1,
    euro: 1.00,
    dollar: 1.04,
    livre: 0.86
  });
  price.create({
    stockPricesId: 2,
    euro: 0.96,
    dollar: 1.00,
    livre: 0.83
  });
  price.create({
    stockPricesId: 3,
    euro: 1.16,
    dollar: 1.21,
    livre: 1.00
  });

  userType.create({
    userTypeId: 1,
    regular: true,
    admin: false,
  });
  userType.create({
    userTypeId: 2,
    regular: false,
    admin: true,
  });
  userType.create({
    userTypeId: 3,
    regular: true,
    admin: true,
  });

  actorType.create({
    actorTypeId: 2,
    seller: true,
    buyer: false,
  });
  actorType.create({
    actorTypeId: 3,
    seller: false,
    buyer: true,
  });
  actorType.create({
    actorTypeId: 1,
    seller: true,
    buyer: true,
  });

  lang.create({
    langueId: 2,
    libelle: "Français",
    nom: "fr",
  });
  lang.create({
    langueId: 1,
    libelle: "English",
    nom: "us",
  });

  paymentType.create({
    paymentTypeId: 1,
    cb: true,
    esp: false,
    chq: false,
  });
  paymentType.create({
    paymentTypeId: 2,
    cb: false,
    esp: true,
    chq: false,
  });
  paymentType.create({
    paymentTypeId: 3,
    cb: false,
    esp: false,
    chq: true,
  });

  devise.create({
    deviseId: 3,
    symbole: "€",
    libelle: "euro"
  });
  devise.create({
    deviseId: 1,
    symbole: "$",
    libelle: "dollar"
  });
  devise.create({
    deviseId: 2,
    symbole: "£",
    libelle: "livre"
  });
}

createViteServer();
