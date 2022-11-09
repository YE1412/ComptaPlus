import { DataTypes } from "sequelize";

const model = (sequelize, Sequelize) => {
	const order = sequelize.define(
		"commande",
		{
			orderId: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true,
				allowNull: false,
			},
			contenuAdditionnel: {
				type: DataTypes.CHAR,
			},
			priceHt: {
				type: DataTypes.FLOAT,
			},
			factureId: {
				type: DataTypes.INTEGER,
				references: {
					model: 'facture',
					key: "factureId"
				},
			},
		},
		{
			freezeTableName: true,
			createdAt: false,
			updatedAt: false,
			deletedAt: false
		}
	);
	return order;
};

export default model;