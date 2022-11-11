import sessions from "../controllers/sessions.controller.js";
import express from "express";
export default () => {
  var router = express.Router();

  // Delete session
  router.post("/logout", sessions.delete);

  // app.use('/api/sessions', router);

  return router;
};
