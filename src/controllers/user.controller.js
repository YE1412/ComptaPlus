import db from "../models/index.js";

const user = db.user;
const Op = db.Sequelize.Op;

const create = (req, res) => {
  // const params = req.params;
  const body = req.body;
  // const query = req.query;
  // console.log('params');
  // console.log(params);
  // console.log('body');
  // console.log(req.body);
  const userObj = {
    lastName: body.lastname,
    firstName: body.firstname,
    login: body.login,
    email: body.email,
    pass: body.password,
    type: body.type,
  };
  // Save user in db
  user
    .create(userObj)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occured while creating user.",
      });
    });
};

const findAll = (req, res) => {
  user
    .findAll({
      where: {},
    })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occured while retieving user.",
      });
    });
};

const findOne = (req, res) => {
  // const params = req.params;
  // const body = req.body;
  const query = req.query;
  // console.log(params);
  // console.log(body);
  // console.log(query);
  let whereClause = {};
  if (query.password !== undefined && query.login !== undefined) {
    whereClause = {
      pass: query.password,
      [Op.or]: [
        {
          login: query.login,
        },
        {
          email: query.login,
        },
      ],
    };
  } else {
    res.status(500).send({
      message: "Some error occured while retrieving user.",
    });
    return;
  }

  user
    .findAll({
      // attributes: [
      // 	'userId',
      // 	'firstName',
      // 	'lastName',
      // 	'login',
      // 	'email',
      // 	'pass',
      // 	'type'
      // ],
      where: whereClause,
    })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occured while retieving user.",
      });
    });
};

const checkOne = (req, res) => {
  // const params = req.params;
  // const body = req.body;
  const query = req.query;
  // console.log(params);

  user
    .findAll({
      where: {
        [Op.or]: [
          {
            login: query.login,
          },
          {
            email: query.login,
          },
        ],
      },
    })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occured while retieving user.",
      });
    });
};

const update = (req, res) => {
  const params = req.params;

  user
    .update(req.body, {
      where: {
        id: params.id,
      },
    })
    .then((res) => {
      if (res === 1) {
        res.send({
          message: "User was updated successfully !",
        });
      } else {
        res.send({
          message: `Cannot update user with id=${params.id}. Maybe User was not found or req.body is empty !`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Error updating User with id=" + params.id,
      });
    });
};

const deleteOne = (req, res) => {
  const params = req.params;

  user
    .destroy({
      where: {
        id: params.id,
      },
    })
    .then((res) => {
      if (res === 1) {
        res.send({
          message: "User was deleted successfully !",
        });
      } else {
        res.send({
          message: `Cannot delete user with id=${params.id}. Maybe User was not found or req.body is empty !`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Error deleting User with id=" + params.id,
      });
    });
};

const deleteAll = (req, res) => {
  user
    .destroy({
      where: {},
      truncate: false,
    })
    .then((res) => {
      res.send({
        message: `${res} Users was deleted successfully !`,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Error deleting Users !",
      });
    });
};

const findAllOfType = (req, res) => {
  const params = req.params;
  // console.log(params);

  user
    .findAll({
      where: {
        type: params.type,
      },
    })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Some error occured while retieving users with type=" + params.type,
      });
    });
};

export default {
  create: create,
  findAll: findAll,
  findOne: findOne,
  checkOne: checkOne,
  update: update,
  deleteOne: deleteOne,
  deleteAll: deleteAll,
  findAllOfType: findAllOfType,
};
