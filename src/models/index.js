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
paymentTypeModelObj.payments = paymentTypeModelObj.hasMany(paymentModelObj, {
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
  foreignKey: 'paymentTypeId'
});
paymentModelObj.paymentType = paymentModelObj.belongsTo(paymentTypeModelObj, {
  foreignKey: 'paymentTypeId',
});
invoiceModelObj.payments = invoiceModelObj.hasMany(paymentModelObj, {
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
  foreignKey: 'factureId'
});
paymentModelObj.invoice = paymentModelObj.belongsTo(invoiceModelObj, {
  foreignKey: 'factureId',
});
invoiceModelObj.devises = invoiceModelObj.hasMany(deviseModelObj, {
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
  foreignKey: 'factureId'
});
deviseModelObj.invoice = deviseModelObj.belongsTo(invoiceModelObj, {
  foreignKey: 'factureId',
});
actorModelObj.invoices = actorModelObj.hasMany(invoiceModelObj, {
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
  foreignKey: 'buyerId'
});
invoiceModelObj.actor = invoiceModelObj.belongsTo(actorModelObj, {
  foreignKey: 'buyerId',
});
actorModelObj.invoices = actorModelObj.hasMany(invoiceModelObj, {
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
  foreignKey: 'sellerId'
});
invoiceModelObj.actor = invoiceModelObj.belongsTo(actorModelObj, {
  foreignKey: 'sellerId',
});
invoiceModelObj.orders = invoiceModelObj.hasMany(orderModelObj, {
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
  foreignKey: 'factureId'
});
orderModelObj.invoice = orderModelObj.belongsTo(invoiceModelObj, {
  foreignKey: 'factureId',
});
orderModelObj.services = orderModelObj.belongsToMany(serviceModelObj, {
  through: 'contains',
  foreignKey: 'serviceId',
  onUpdate: 'CASCADE',
  onDelete: 'CASCADE',
});
serviceModelObj.orders = serviceModelObj.belongsToMany(orderModelObj, {
  through: 'contains',
  foreignKey: 'orderId',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});
langueModelObj.invoices = langueModelObj.hasMany(invoiceModelObj, {
  onDelete: 'SET NULL',
  onUpdate: 'CASCADE',
  foreignKey: 'languageId'
});
invoiceModelObj.langue = invoiceModelObj.belongsTo(langueModelObj, {
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
