import { DataTypes } from "sequelize";

const model = (sequelize) => {
  const actorActivity = sequelize.define(
    "personne_activite",
    {
      actorId: {
        type: DataTypes.INTEGER,
        references: {
          model: "personne",
          key: "actorId",
        },
        allowNull: false,
      },
      actorTypeId: {
        type: DataTypes.INTEGER,
        references: {
          model: "personne_type",
          key: "actorTypeId",
        },
        allowNull: false,
      },
    },
    {
      freezeTableName: true,
      createdAt: false,
      updatedAt: false,
      deletedAt: false,
    }
  );
  return actorActivity;
};

export default model;
