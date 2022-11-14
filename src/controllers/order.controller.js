import db from "../models/index.js";

const order = db.order;
// const invoice = db.invoice;
const service = db.service;
// const Op = db.Sequelize.Op;

const create = (req, res) => {
  const body = req.body;
  const orderObj = {
    cp: body.cp,
    email: body.email,
    nom: body.nom,
    prenom: body.prenom,
    nomRue: body.nomRue,
    numCommercant: body.numCommercant,
    numRue: body.numRue,
    tel: body.tel,
    ville: body.ville,
    actorTypeId: body.type,
  };
  // Save order in db
  order
    .create(orderObj)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occured while creating order.",
        error: err,
      });
    });
};

const findAll = (req, res) => {
  order
    .findAll({
      attributes: ["orderId", "contenuAdditionnel", "priceHt", "factureId"],
      where: {},
      // include: type,
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

// const findAllTypes = (req, res) => {
//   type
//     .findAll({
//       where: {},
//     })
//     .then((data) => {
//       res.send(data);
//     })
//     .catch((err) => {
//       res.status(500).send({
//         message:
//           err.message || "Some error occured while retieving actor type.",
//       });
//     });
// };

const findOne = (req, res) => {
  const query = req.query;
  // let whereClause = {};
  if (query.orderId === undefined) {
    res.status(500).send({
      message: "Some error occured while retrieving order.",
    });
    return;
  }

  order
    .findByPk(query.orderId, {
      include: [
        {
          model: service,
          through: { attributes: [] },
        },
      ],
    })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occured while retieving order.",
      });
    });
};

const update = (req, res) => {
  const params = req.params;

  order
    .update(req.body, {
      where: {
        orderId: params.id,
      },
    })
    .then((result) => {
      // console.log(result);
      if (result[0] === 1) {
        res.send({
          message: "Order was updated successfully !",
        });
      } else {
        res.send({
          message: `Cannot update actor with id=${params.id}. Maybe Order was not found or req.body is empty !`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Error updating Order with id=" + params.id,
      });
    });
};

const deleteOne = (req, res) => {
  const params = req.params;

  order
    .destroy({
      where: {
        orderId: params.id,
      },
    })
    .then((result) => {
      if (result === 1) {
        res.send({
          message: "Order was deleted successfully !",
        });
      } else {
        res.send({
          message: `Cannot delete actor with id=${params.id}. Maybe Order was not found or req.body is empty !`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Error deleting Order with id=" + params.id,
      });
    });
};

const deleteAll = (req, res) => {
  order
    .destroy({
      where: {},
      truncate: false,
    })
    .then((res) => {
      res.send({
        message: `${res} Orders was deleted successfully !`,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Error deleting Orders !",
      });
    });
};

// const findByTypes = (req, res) => {
//   const params = req.params;

//   let whereClause = {};
//   if (params.types !== undefined) {
//     whereClause.actorTypeId = {
//       [Op.or]: params.types,
//     };
//   } else {
//     res.status(500).send({
//       message: "Some error occured while retrieving orders.",
//     });
//     return;
//   }

//   order
//     .findAll(
//       {
//         where: whereClause,
//       },
//       {
//         include: type,
//       }
//     )
//     .then((data) => {
//       res.send(data);
//     })
//     .catch((err) => {
//       res.status(500).send({
//         message:
//           err.message ||
//           `Some error occured while retieving orders with type=${params.type}.`,
//       });
//     });
// };

export default {
  create: create,
  findAll: findAll,
  findOne: findOne,
  // findByTypes: findByTypes,
  // findAllTypes: findAllTypes,
  update: update,
  deleteOne: deleteOne,
  deleteAll: deleteAll,
};
