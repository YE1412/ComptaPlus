import { DataTypes } from "sequelize";

const model = (sequelize, Sequelize) => {
	const paymentType = sequelize.define(
		"payment_type",
		{
			paymentTypeId: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true,
				allowNull: false,
			},
			libelle: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			paymentId: {
		       type: DataTypes.INTEGER,
		       references: {
		          model: 'payment', 
		          key: 'paymentId', 
		       }
		    }
		},
		{
			freezeTableName: true,
			createdAt: false,
			updatedAt: false,
			deletedAt: false
		}
	);
	return paymentType;
};

export default model;