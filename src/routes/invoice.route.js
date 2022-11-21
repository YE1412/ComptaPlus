import invoices from "../controllers/invoice.controller.js";
import express from "express";
export default () => {
  var router = express.Router();

  // Create a new Invoice
  router.post("/", invoices.create);

  // Retrieve all Invoices
  router.get("/", invoices.findAll);

  // Retrieve a single Invoice with id
  router.get("/find", invoices.findOne);

  // Retrieve more Invoices with ids
  router.get("/find/:ids", invoices.findMore);

  // Retrieve all Orders
  router.get("/orders", invoices.findAllOrders);

  // Retrieve all Sellers
  router.get("/sellers", invoices.findAllSellers);

  // Retrieve all Buyers
  router.get("/buyers", invoices.findAllBuyers);

  // Retrieve all Devises
  router.get("/devises", invoices.findAllDevises);

  // Retrieve all Languages
  router.get("/languages", invoices.findAllLanguages);

  // Retrieve all Payments
  router.get("/payments", invoices.findAllPayments);

  // Update a Invoice with id
  router.put("/:id", invoices.update);

  // Delete a Invoice with id
  router.delete("/:id", invoices.deleteOne);

  // Delete all Invoices
  router.delete("/", invoices.deleteAll);

  // app.use('/api/invoices', router);

  return router;
};
