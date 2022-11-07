import db from "../models/index.js";

const user = db.user;
const Op = db.Sequelize.Op;

const create = (req, res) => {
	const params = req.body;
	console.log(params);
	const userObj = {
		lastname: params.lastname,
		firstname: params.firstname,
		login: params.login,
		email: params.email,
		password: params.password,
		type: params.type
	};
	// Save user in db
	user.create(userObj)
	.then((data) => {
		res.send(data);
	})
	.catch((err) => {
		res.status(500).send({
			message: err.message || "Some error occured while creating user."
		});
	});
};

const findAll = (req, res) => {};

const findOne = (req, res) => {
  const params = req.params;
  console.log(params);

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
    where: {
      pass: params.pass,
      [Op.or]: [
        {
          login: params.login,
        },
        {
          email: params.login,
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

const checkOne = (req, res) => {
  const params = req.params;
  console.log(params);

  user
    .findAll({
      where: {
        [Op.or]: [
          {
            login: params.login,
          },
          {
            email: params.login,
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

const update = (req, res) => {};

const deleteOne = (req, res) => {};

const deleteAll = (req, res) => {};

const findAllOfType = (req, res) => {};

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
