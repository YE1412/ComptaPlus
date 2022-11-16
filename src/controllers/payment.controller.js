import db from "../models/index.js";

const payment = db.payment;
const paymentType = db.paymentType;
// const service = db.service;
// const contains = db.contains;
const Op = db.Sequelize.Op;

const create = async (req, res) => {
  const body = req.body;
  const paymentObj = {
    etat: body.etat,
    paymentValue: body.paymentValue,
    paymentType: body.paymentTypeId,
    factureId: body.factureId
  };

  // 1. INSERT a new payment
  const paymentStatement = await payment
    .create(paymentObj)
    .then(async (data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occured while creating payment.",
        error: err,
      });
    });
};

const findAll = (req, res) => {
  payment
    .findAll({
      attributes: [
        "paymentId",
        "etat",
        "paymentValue",
        "paymentType.paymentTypeId",
        "facture.factureId"
      ],
      where: {},
      include: [payment.paymentType, payment.invoice],
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

const findOne = (req, res) => {
  const query = req.query;
  // let whereClause = {};
  if (query.paymentId === undefined) {
    res.status(500).send({
      message: "Some error occured while retrieving payment.",
    });
    return;
  }

  payment
    .findByPk(query.paymentId, {
      include: [payment.paymentType, payment.invoice],
    })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || `Some error occured while retieving payment with id=${query.paymentId}.`,
      });
    });
};

const update = async (req, res) => {
  const params = req.params;
  const body = req.body;
  const paymentObj = {
    etat: body.etat,
    paymentValue: body.paymentValue,
    paymentType: body.paymentTypeId,
    factureId: body.factureId
  };

  const paymentStatement = await payment
    .update(
      paymentObj,
      {
        where: {
          paymentId: params.id,
        },
      }
    )
    .then(async (data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || `Some error occured while updating payment with id=${params.id}.`,
        error: err,
      });
    });
};

const deleteOne = (req, res) => {
  const params = req.params;

  payment
    .destroy({
      where: {
        paymentId: params.id,
      },
    })
    .then((result) => {
      if (result === 1) {
        res.send({
          message: "Payment was deleted successfully !",
        });
      } else {
        res.send({
          message: `Cannot delete payment with id=${params.id}. Maybe Payment was not found or req.body is empty !`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Error deleting Payment with id=" + params.id,
      });
    });
};

const deleteAll = (req, res) => {
  payment
    .destroy({
      where: {},
      truncate: false,
    })
    .then((res) => {
      res.send({
        message: `${res} Payments was deleted successfully !`,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Error deleting payments !",
      });
    });
};

const findAllTypes = (req, res) => {
  paymentType
    .findAll({
      where: {}
    })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occured while retieving payment types.",
      });
    });
};

const findByTypes = (req, res) => {
  const params = req.params;

  let whereClause = {};
  if (params.paymentTypesId !== undefined) {
    whereClause.paymentTypeId = {
      [Op.or]: params.paymentTypesId,
    };
  } else {
    res.status(500).send({
      message: "Some error occured while retrieving payments.",
    });
    return;
  }

  paymentType
    .find({
      where: whereClause
    })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || `Some error occured while retieving payment types with ids=${params.paymentTypesId}.`,
      });
    });
};

export default {
  create: create,
  findAll: findAll,
  findOne: findOne,
  findByTypes: findByTypes,
  findAllTypes: findAllTypes,
  update: update,
  deleteOne: deleteOne,
  deleteAll: deleteAll,
};