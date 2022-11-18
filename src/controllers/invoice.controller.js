import db from "../models/index.js";

const invoice = db.invoice;
const language = db.langue;
const devise = db.devise;
const order = db.order;
const actor = db.actor;
const payment = db.payment;
const Op = db.Sequelize.Op;

const create = async (req, res) => {
  const body = req.body;
  let paymentsTab = [],
    paymentsRow = [],
    ordersTab = [],
    ordersRow = [];
  for (const key in body.payments){
    paymentsTab.push({
      paymentId: body.payments[key].value,
      etat: body.payments[key].etat,
      paymentValue: body.payments[key].paymentValue,
      paymentType: body.payments[key].paymentType,
    });
  }
  for (const key in body.orders){
    ordersTab.push({
      orderId: body.orders[key].value,
      contenuAdditionnel: body.orders[key].contenuAdditionnel,
      priceHt: body.orders[key].priceHt,
    });
  }
  const invoiceObj = {
    date: body.date,
    invoiceHTPrice: body.invoiceHTPrice,
    invoiceTTPrice: body.invoiceTTPrice,
    languageId: body.languageId,
    deviseId: body.deviseId,
    tvaValue: body.tvaValue,
    buyerId: body.buyerId,
    sellerId: body.sellerId,
    commande: ordersTab,
    payment: paymentsTab 
  };

  // 1. INSERT a new invoice
  await invoice
    .create(invoiceObj, {
      include: [
        invoice.payments,
        invoice.orders,
      ],
    })
    .then(async (data) => {
      // 2.1 Find the payments rows
      for (const key in body.payments) {
        paymentsRow[key] = await payment
          .findByPk(body.payments[key].value)
          .then((data2) => {
            return data2;
          })
          .catch((err) => {
            res.status(500).send({
              message:
                err.message ||
                "Some error occured while fetching payment with id=" +
                  body.payments[key].value,
              error: err,
            });
          });
      }
      // 2.2 Find the orders rows
      for (const key in body.orders) {
        ordersRow[key] = await order
          .findByPk(body.orders[key].value)
          .then((data2) => {
            return data2;
          })
          .catch((err) => {
            res.status(500).send({
              message:
                err.message ||
                "Some error occured while fetching order with id=" +
                  body.orders[key].value,
              error: err,
            });
          });
      }
      // 3. INSERT the association in tables
      await data.addPayments(paymentsRow)
        .then((data2) => {
        })
        .catch((err) => {
          res.status(500).send({
            message:
              err.message ||
              "Some error occured while inserting in associated table payment with invoice id=" +
                data.factureId,
            error: err,
          });
        });
        data.addCommandes(ordersRow)
        .then((data2) => {
          res.send(data2);
        })
        .catch((err) => {
          res.status(500).send({
            message:
              err.message ||
              "Some error occured while inserting in associated table commande with invoice id=" +
                data.factureId,
            error: err,
          });
        });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occured while creating invoice.",
        error: err,
      });
    });
};

const findAll = (req, res) => {
  invoice
    .findAll({
      attributes: [
        "factureId",
        "date",
        "invoiceHTPrice",
        "invoiceTTPrice",
        "tvaValue",
        "langue.langueId",
        "devise.deviseId",
        "buyer.actorId",
        "seller.actorId",
        "commandes.orderId",
        "payments.paymentId"
      ],
      where: {},
      include: [
        invoice.langue,
        invoice.devise,
        {model: actor, as: "buyer"}, 
        {model: actor, as: "seller"}, 
        invoice.orders,
        invoice.payments
      ],
    })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occured while retieving invoices.",
        error: err
      });
    });
};

const findOne = (req, res) => {
  const query = req.query;
  // let whereClause = {};
  if (query.invoiceId === undefined) {
    res.status(500).send({
      message: `Some error occured while retrieving invoice with id=${query.invoiceId}, bad query.`,
    });
    return;
  }

  invoice
    .findByPk(query.invoiceId, {
      attributes: [
        "factureId",
        "date",
        "invoiceHTPrice",
        "invoiceTTPrice",
        "tvaValue",
        "langue.langueId",
        "devise.deviseId",
        "buyer.actorId",
        "seller.actorId",
        "commandes.orderId",
        "payments.paymentId"
      ],
      include: [
        invoice.langue,
        invoice.devise,
        {model: actor, as: "buyer"}, 
        {model: actor, as: "seller"}, 
        invoice.orders,
        invoice.payments
      ],
    })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          `Some error occured while retieving invoice with id=${query.invoiceId}.`,
      });
    });
};

const update = async (req, res) => {
  const params = req.params;
  const body = req.body;
  let paymentsTab = [],
    paymentsRow = [],
    ordersTab = [],
    ordersRow = [];
  for (const key in body.payments){
    paymentsTab.push({
      paymentId: body.payments[key].value,
      etat: body.payments[key].etat,
      paymentValue: body.payments[key].paymentValue,
      paymentType: body.payments[key].paymentType,
      factureId: params.id,
    });
  }
  for (const key in body.orders){
    ordersTab.push({
      orderId: body.orders[key].value,
      contenuAdditionnel: body.orders[key].contenuAdditionnel,
      priceHt: body.orders[key].priceHt,
      factureId: params.id,
    });
  }
  const invoiceObj = {
    date: body.date,
    invoiceHTPrice: body.invoiceHTPrice,
    invoiceTTPrice: body.invoiceTTPrice,
    languageId: body.languageId,
    deviseId: body.deviseId,
    tvaValue: body.tvaValue,
    buyerId: body.buyerId,
    sellerId: body.sellerId,
    commande: ordersTab,
    payment: paymentsTab 
  };

  // 1. UPDATE an invoice
  const invoiceModel = await invoice.findByPk(params.id, {
    include: [invoice.payments, invoice.orders],
  });
  await invoice
    .update(invoiceObj, {
      where: {
        factureId: params.id,
      },
      include: [
        invoice.payments,
        invoice.orders,
      ],
    })
    .then(async (data) => {
      // 2.1 Find the payments rows
      for (const key in body.payments) {
        paymentsRow[key] = await payment
          .findByPk(body.payments[key].value)
          .then((data2) => {
            return data2;
          })
          .catch((err) => {
            res.status(500).send({
              message:
                err.message ||
                "Some error occured while fetching payment with id=" +
                  body.payments[key].value,
              error: err,
            });
          });
      }
      // 2.2 Find the orders rows
      for (const key in body.orders) {
        ordersRow[key] = await order
          .findByPk(body.orders[key].value)
          .then((data2) => {
            return data2;
          })
          .catch((err) => {
            res.status(500).send({
              message:
                err.message ||
                "Some error occured while fetching order with id=" +
                  body.orders[key].value,
              error: err,
            });
          });
      }
      // 3. DELETE the old association in tables
      await invoiceModel.removePayments(invoiceModel.payment);
      await invoiceModel.removeCommandes(invoiceModel.commande);
      // 4. INSERT the old association in tables
      await invoiceModel.addPayments(paymentsRow)
        .then((data2) => {
        })
        .catch((err) => {
          res.status(500).send({
            message:
              err.message ||
              "Some error occured while inserting in associated table payment with invoice id=" +
                data.factureId,
            error: err,
          });
        });
        invoiceModel.addCommandes(ordersRow)
        .then((data2) => {
          res.send(data2);
        })
        .catch((err) => {
          res.status(500).send({
            message:
              err.message ||
              "Some error occured while inserting in associated table commande with invoice id=" +
                data.factureId,
            error: err,
          });
        });
      // res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          `Some error occured while updating invoice with id=${params.id}.`,
        error: err,
      });
    });
};

const deleteOne = (req, res) => {
  const params = req.params;

  invoice
    .destroy({
      where: {
        factureId: params.id,
      },
    })
    .then((result) => {
      if (result === 1) {
        res.send({
          message: "Invoice was deleted successfully !",
        });
      } else {
        res.send({
          message: `Cannot delete invoice with id=${params.id}. Maybe Payment was not found or req.body is empty !`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Error deleting Invoice with id=" + params.id,
      });
    });
};

const deleteAll = (req, res) => {
  invoice
    .destroy({
      where: {},
      truncate: false,
    })
    .then((res) => {
      res.send({
        message: `${res} Invoices was deleted successfully !`,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Error deleting invoices !",
      });
    });
};

const findAllLanguages = (req, res) => {
  language
    .findAll({
      where: {},
    })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occured while retieving languages.",
      });
    });
};

const findAllOrders = (req, res) => {
  order
    .findAll({
      where: {},
    })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occured while retieving orders.",
      });
    });
};

const findAllDevises = (req, res) => {
  devise
    .findAll({
      where: {}
    })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occured while retieving devises.",
      });
    });
};

const findAllPayments = (req, res) => {
  payment
    .findAll({
      where: {},
    })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occured while retieving payments.",
      });
    });
};

const findAllSellers = (req, res) => {
  actor
    .findAll({
      where: {
        actorTypeId: {
          [Op.or]: [1, 2]
        }
      },
    })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occured while retieving sellers.",
      });
    });
};

const findAllBuyers = (req, res) => {
  actor
    .findAll({
      where: {
        actorTypeId: {
          [Op.or]: [1, 3]
        }
      },
    })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occured while retieving buyers.",
      });
    });
};

// const findByType = (req, res) => {
//   const params = req.params;

//   let whereClause = {};
//   if (params.paymentTypesId !== undefined) {
//     whereClause.paymentTypeId = {
//       [Op.or]: params.paymentTypesId,
//     };
//   } else {
//     res.status(500).send({
//       message: "Some error occured while retrieving payments.",
//     });
//     return;
//   }

//   paymentType
//     .find({
//       where: whereClause,
//     })
//     .then((data) => {
//       res.send(data);
//     })
//     .catch((err) => {
//       res.status(500).send({
//         message:
//           err.message ||
//           `Some error occured while retieving payment types with ids=${params.paymentTypesId}.`,
//       });
//     });
// };

export default {
  create: create,
  findAll: findAll,
  findOne: findOne,
  findAllLanguages: findAllLanguages,
  findAllDevises: findAllDevises,
  findAllSellers: findAllSellers,
  findAllBuyers: findAllBuyers,
  findAllPayments: findAllPayments,
  findAllOrders: findAllOrders,
  update: update,
  deleteOne: deleteOne,
  deleteAll: deleteAll,
};
