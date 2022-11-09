import dbConfig from "../config/db.config.js";
import { Sequelize } from "sequelize";
import actor from "./actor.model.js";
import contains from "./contains.model.js";
import devise from "./devise.model.js";
import invoice from "./invoice.model.js";
import langue from "./langue.model.js";
import order from "./order.model.js";
import payment from "./payment.model.js";
import paymentType from "./paymentType.model.js";
import service from "./service.model.js";
import user from "./user.model.js";


const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  logging: console.log,
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  port: dbConfig.PORT,
  // operatorsAliases: false,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
});

const db = {};
const userModelObj = user(sequelize, Sequelize);
const serviceModelObj = service(sequelize, Sequelize);
const actorModelObj = actor(sequelize, Sequelize);
const langueModelObj = langue(sequelize, Sequelize);
const deviseModelObj = devise(sequelize, Sequelize);
const invoiceModelObj = invoice(sequelize, Sequelize);
const orderModelObj = order(sequelize, Sequelize);
const containsModelObj = contains(sequelize, Sequelize);
const paymentModelObj = payment(sequelize, Sequelize);
const paymentTypeModelObj = paymentType(sequelize, Sequelize);

// ASSOCIATIONS
paymentModelObj.hasOne(paymentTypeModelObj, {
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
  foreignKey: 'paymentId'
});
paymentTypeModelObj.belongsTo(paymentModelObj, {
  foreignKey: 'paymentId',
});
invoiceModelObj.hasMany(paymentModelObj, {
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
  foreignKey: 'factureId'
});
paymentModelObj.belongsTo(invoiceModelObj, {
  foreignKey: 'factureId',
});
invoiceModelObj.hasMany(deviseModelObj, {
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
  foreignKey: 'factureId'
});
deviseModelObj.belongsTo(invoiceModelObj, {
  foreignKey: 'factureId',
});
actorModelObj.hasMany(invoiceModelObj, {
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
  foreignKey: 'buyerId'
});
invoiceModelObj.belongsTo(actorModelObj, {
  foreignKey: 'buyerId',
});
actorModelObj.hasMany(invoiceModelObj, {
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
  foreignKey: 'sellerId'
});
invoiceModelObj.belongsTo(actorModelObj, {
  foreignKey: 'sellerId',
});
invoiceModelObj.hasMany(orderModelObj, {
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
  foreignKey: 'factureId'
});
orderModelObj.belongsTo(invoiceModelObj, {
  foreignKey: 'factureId',
});
orderModelObj.belongsToMany(serviceModelObj, {
  through: 'contains',
  foreignKey: 'serviceId',
  onUpdate: 'CASCADE',
  onDelete: 'CASCADE',
});
serviceModelObj.belongsToMany(orderModelObj, {
  through: 'contains',
  foreignKey: 'orderId',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});
langueModelObj.hasOne(invoiceModelObj, {
  onDelete: 'SET NULL',
  onUpdate: 'CASCADE',
  foreignKey: 'languageId'
});
invoiceModelObj.belongsTo(langueModelObj, {
  foreignKey: 'languageId',
});
// -------------

db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.user = userModelObj;
db.service = serviceModelObj;
db.actor = actorModelObj;
db.langue = langueModelObj;
db.devise = deviseModelObj;
db.invoice = invoiceModelObj;
db.order = orderModelObj;
db.contains = containsModelObj;
db.paymentType = paymentTypeModelObj;
db.payment = paymentModelObj;

export default db;
