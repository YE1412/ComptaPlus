import { DataTypes } from "sequelize";

const model = (sequelize, Sequelize) => {
	const payment = sequelize.define(
		"payment",
		{
			paymentId: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true,
				allowNull: false,
			},
			etat: {
				type: DataTypes.INTEGER(1),
				allowNull: false,
			},
			paymentValue: {
				type: DataTypes.FLOAT,
				allowNull: false,
			},
			factureId: {
				type: DataTypes.INTEGER,
				reference: {
					model: "facture",
					key: "factureId",
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
	return payment;
};

export default model;