import payments from "../controllers/payment.controller.js";
import express from "express";
export default () => {
  var router = express.Router();

  // Create a new Payment
  router.post("/", payments.create);

  // Retrieve all Payments
  router.get("/", payments.findAll);

  // Retrieve a single Payment with id
  router.get("/find", payments.findOne);

  // Retrieve all Payments type
  router.get("/types", payments.findAllTypes);

  // Retrieve all Payments by type
  router.get("/types/:type", payments.findByTypes);

  // Update a Payment with id
  router.put("/:id", payments.update);

  // Delete a Payment with id
  router.delete("/:id", payments.deleteOne);

  // Delete all Payments
  router.delete("/", payments.deleteAll);

  // app.use('/api/payments', router);

  return router;
};
