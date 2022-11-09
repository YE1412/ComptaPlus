import services from "../controllers/service.controller.js";
import express from "express";
export default () => {
  var router = express.Router();

  // Create a new Service
  router.post("/", services.create);

  // Retrieve all Services
  router.get("/", services.findAll);

  // Retrieve all Services by amount and type
  router.get("amount/:montantHt/type/:type", services.findAllOfAmountComp);

  // Retrieve a single Service with id
  router.get("/find", services.findOne);

  // Update a Service with id
  router.put("/:id", services.update);

  // Delete a Service with id
  router.delete("/:id", services.deleteOne);

  // Delete all Services
  router.delete("/", services.deleteAll);

  // app.use('/api/services', router);

  return router;
};
