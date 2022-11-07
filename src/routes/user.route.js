import users from "../controllers/user.controller.js";
import express from "express";
export default () => {
  // const users = require("../controllers/user.controller.js");

  var router = express.Router();

  // Create a new User
  router.post("/", users.create);

  // Retrieve all Users
  router.get("/", users.findAll);

  // Retrieve all Users by type
  router.get("/type/:type", users.findAllOfType);

  // Retrieve a single User with email and password
  router.get("/login/:login/pass/:pass", users.findOne);

  // Retrieve a single User with email
  router.get("/email/:login", users.checkOne);

  // Retrieve a single User with login
  router.get("/login/:login", users.checkOne);

  // Update a User with id
  router.put("/:id", users.update);

  // Delete a User with id
  router.delete("/:id", users.deleteOne);

  // Delete all Users
  router.delete("/", users.deleteAll);

  // app.use('/api/users', router);

  return router;
};
