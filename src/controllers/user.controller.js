import db from "../models/index.js";

const user = db.user;
const Op = db.Sequelize.Op;

const create = (req, res) => {
	const params = req.params;
	// console.log('params');
	// console.log(params);
	// console.log('body');
	// console.log(req.body);
	const userObj = {
		lastName: req.body.lastname,
		firstName: req.body.firstname,
		login: req.body.login,
		email: req.body.email,
		pass: req.body.password,
		type: req.body.type
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

const update = (req, res) => {
	const params = req.params;

	user.update(req.body, {
		where: {
			id: params.id
		}
	})
	.then((res) => {
		if (res === 1){
			res.send({
				message: "User was updated successfully !",
			});
		}
		else{
			res.send({
				message: `Cannot update user with id=${params.id}. Maybe User was not found or req.body is empty !`,
			});
		}
	})
	.catch((err) => {
		res.status(500).send({
			message: err.message || "Error updating User with id="+ params.id,
		});	
	});
};

const deleteOne = (req, res) => {
	const params = req.params;

	user.destroy({
		where: {
			id: params.id,
		}
	})
	.then((res) => {
		if (res === 1){
			res.send({
				message: "User was deleted successfully !",
			});
		}
		else{
			res.send({
				message: `Cannot delete user with id=${params.id}. Maybe User was not found or req.body is empty !`,
			});
		}
	})
	.catch((err) => {
		res.status(500).send({
			message: err.message || "Error deleting User with id="+ params.id,
		});	
	});
};

const deleteAll = (req, res) => {
	user.destroy({
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
      	type: params.type
      },
    })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occured while retieving users with type="+params.type,
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
