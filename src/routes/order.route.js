import orders from "../controllers/order.controller.js";
import express from "express";
export default () => {
  var router = express.Router();

  // Create a new Order
  router.post("/", orders.create);

  // Retrieve all Orders
  router.get("/", orders.findAll);

  // Retrieve a single Order with id
  router.get("/find", orders.findOne);

  // Update a Order with id
  router.put("/:id", orders.update);

  // Delete a Order with id
  router.delete("/:id", orders.deleteOne);

  // Delete all Orders
  router.delete("/", orders.deleteAll);

  // app.use('/api/orders', router);

  return router;
};
