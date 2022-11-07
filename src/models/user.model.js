const model = (sequelize, Sequelize) => {
  const user = sequelize.define(
    "user",
    {
      userId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      firstName: {
        type: Sequelize.STRING,
      },
      lastName: {
        type: Sequelize.STRING,
      },
      login: {
        type: Sequelize.STRING,
      },
      email: {
        type: Sequelize.STRING,
      },
      pass: {
        type: Sequelize.STRING,
      },
      type: {
        type: Sequelize.INTEGER,
      },
    },
    {
      freezeTableName: true,
      createdAt: false,
      updatedAt: false,
      deletedAt: false,
    }
  );

  return user;
};

export default model;
