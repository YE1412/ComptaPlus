import { DataTypes } from "sequelize";

const model = (sequelize, Sequelize) => {
	const actor = sequelize.define(
		"personne",
		{
			actorId: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true,
				allowNull: false,
			},
			cp: {
				type: DataTypes.CHAR,
				allowNull: false
			},
			email: {
				type: DataTypes.CHAR,
				allowNull: false,
			},
			nom: {
				type: DataTypes.CHAR,
				allowNull: false,
			},
			nomRue: {
				type: DataTypes.CHAR,
				allowNull: false,
			},
			numCommercant: {
				type: DataTypes.CHAR,
				allowNull: false,
			},
			numRue: {
				type: DataTypes.CHAR,
				allowNull: false
			},
			prenom: {
				type: DataTypes.CHAR,
				allowNull: false,
			},
			tel: {
				type: DataTypes.CHAR,
				allowNull: false,
			},
			type: {
				type: DataTypes.INTEGER,
			},
			ville: {
				type: DataTypes.CHAR,
				allowNull: false,
			},
		},
		{
			freezeTableName: true,
			createdAt: false,
			updatedAt: false,
			deletedAt: false
		}
	);
	return actor;
};

export default model;