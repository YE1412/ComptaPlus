// import db from "../models/index.js";

// const payment = db.payment;
// const Op = db.Sequelize.Op;

// const create = (req, res) => {
//   const body = req.body;
//   const paymentObj = {
//     paymentType: {},
//     invoice: {
//       seller: {},
//       buyer: {},
//       orders: [],
//       devises: [],
//       payments: [],
//       langue: {},
//     },
//   };
//   // Save user in db
//   payment
//     .create(paymentObj, {
//       include: [
//         {
//           association: payment.invoice,
//           include: [invoice.orders],
//         },
//       ],
//     })
//     .then((data) => {
//       res.send(data);
//     })
//     .catch((err) => {
//       res.status(500).send({
//         message: err.message || "Some error occured while creating user.",
//       });
//     });
// };

// const findAll = (req, res) => {
// user
//   .findAll({
//     where: {},
//   })
//   .then((data) => {
//     res.send(data);
//   })
//   .catch((err) => {
//     res.status(500).send({
//       message: err.message || "Some error occured while retieving user.",
//     });
//   });
// };

// const findOne = (req, res) => {
// const query = req.query;
// let whereClause = {};
// if (query.password !== undefined && query.login !== undefined) {
//   whereClause = {
//     pass: query.password,
//     [Op.or]: [
//       {
//         login: query.login,
//       },
//       {
//         email: query.login,
//       },
//     ],
//   };
// } else {
//   res.status(500).send({
//     message: "Some error occured while retrieving user.",
//   });
//   return;
// }
// user
//   .findAll({
//     where: whereClause,
//   })
//   .then((data) => {
//     res.send(data);
//   })
//   .catch((err) => {
//     res.status(500).send({
//       message: err.message || "Some error occured while retieving user.",
//     });
//   });
// };

// const checkOne = (req, res) => {
// const query = req.query;
// user
//   .findAll({
//     where: {
//       [Op.or]: [
//         {
//           login: query.login,
//         },
//         {
//           email: query.login,
//         },
//       ],
//     },
//   })
//   .then((data) => {
//     res.send(data);
//   })
//   .catch((err) => {
//     res.status(500).send({
//       message: err.message || "Some error occured while retieving user.",
//     });
//   });
// };

// const update = (req, res) => {
// const params = req.params;
// user
//   .update(req.body, {
//     where: {
//       id: params.id,
//     },
//   })
//   .then((result) => {
//     if (result === 1) {
//       res.send({
//         message: "User was updated successfully !",
//       });
//     } else {
//       res.send({
//         message: `Cannot update user with id=${params.id}. Maybe User was not found or req.body is empty !`,
//       });
//     }
//   })
//   .catch((err) => {
//     res.status(500).send({
//       message: err.message || "Error updating User with id=" + params.id,
//     });
//   });
// };

// const deleteOne = (req, res) => {
// const params = req.params;
// user
//   .destroy({
//     where: {
//       id: params.id,
//     },
//   })
//   .then((result) => {
//     if (result === 1) {
//       res.send({
//         message: "User was deleted successfully !",
//       });
//     } else {
//       res.send({
//         message: `Cannot delete user with id=${params.id}. Maybe User was not found or req.body is empty !`,
//       });
//     }
//   })
//   .catch((err) => {
//     res.status(500).send({
//       message: err.message || "Error deleting User with id=" + params.id,
//     });
//   });
// };

// const deleteAll = (req, res) => {
// user
//   .destroy({
//     where: {},
//     truncate: false,
//   })
//   .then((res) => {
//     res.send({
//       message: `${res} Users was deleted successfully !`,
//     });
//   })
//   .catch((err) => {
//     res.status(500).send({
//       message: err.message || "Error deleting Users !",
//     });
//   });
// };

// const findAllOfType = (req, res) => {
// const params = req.params;
// user
//   .findAll({
//     where: {
//       type: params.type,
//     },
//   })
//   .then((data) => {
//     res.send(data);
//   })
//   .catch((err) => {
//     res.status(500).send({
//       message:
//         err.message ||
//         "Some error occured while retieving users with type=" + params.type,
//     });
//   });
// };

export default {
  // create: create,
  // findAll: findAll,
  // findOne: findOne,
  // checkOne: checkOne,
  // update: update,
  // deleteOne: deleteOne,
  // deleteAll: deleteAll,
  // findAllOfType: findAllOfType,
};
