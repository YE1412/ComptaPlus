import { DataTypes } from "sequelize";

const model = (sequelize, Sequelize) => {
	const devise = sequelize.define(
		"devise",
		{
			deviseId: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true,
				allowNull: false,
			},
			symbole: {
				type: DataTypes.CHAR(1)
			},
			factureId: {
				type: DataTypes.INTEGER,
				reference: {
					model: 'facture',
					key: "factureId"
				},
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
	return devise;
};

export default model;