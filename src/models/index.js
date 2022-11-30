import dbConfig from "../config/db.config.js";
import { Sequelize } from "sequelize";
import actor from "./actor.model.js";
import actorType from "./actorType.model.js";
import contains from "./contains.model.js";
import devise from "./devise.model.js";
import invoice from "./invoice.model.js";
import langue from "./langue.model.js";
import order from "./order.model.js";
import payment from "./payment.model.js";
import paymentType from "./paymentType.model.js";
import price from "./price.model.js";
import service from "./service.model.js";
import user from "./user.model.js";
import userType from "./userType.model.js";

// console.log(dbConfig);

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  logging: dbConfig.ENV === "development" ? console.log :  false,
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
const userModelObj = user(sequelize);
const serviceModelObj = service(sequelize);
const actorModelObj = actor(sequelize);
const langueModelObj = langue(sequelize);
const deviseModelObj = devise(sequelize);
const invoiceModelObj = invoice(sequelize);
const orderModelObj = order(sequelize);
const containsModelObj = contains(sequelize);
const paymentModelObj = payment(sequelize);
const paymentTypeModelObj = paymentType(sequelize);
const priceModelObj = price(sequelize);
const actorTypeModelObj = actorType(sequelize);
const userTypeModelObj = userType(sequelize);

// ASSOCIATIONS
userTypeModelObj.users = userTypeModelObj.hasMany(userModelObj, {
  onDelete: "SET NULL",
  onUpdate: "CASCADE",
  foreignKey: "userTypeId",
});
userModelObj.type = userModelObj.belongsTo(userTypeModelObj, {
  foreignKey: "userTypeId",
});

actorTypeModelObj.actors = actorTypeModelObj.hasMany(actorModelObj, {
  foreignKey: "actorTypeId",
  onUpdate: "CASCADE",
  onDelete: "SET NULL",
});
actorModelObj.type = actorModelObj.belongsTo(actorTypeModelObj, {
  foreignKey: "actorTypeId",
});

// actorModelObj.types = actorModelObj.belongsToMany(actorTypeModelObj, {
//   through: "personne_activite",
//   foreignKey: "actorTypeId",
//   onUpdate: "CASCADE",
//   onDelete: "CASCADE",
//   as: "types"
// });
// actorTypeModelObj.actors = actorTypeModelObj.belongsToMany(actorModelObj, {
//   through: "personne_activite",
//   foreignKey: "actorId",
//   onDelete: "CASCADE",
//   onUpdate: "CASCADE",
//   as: "actors"
// });

paymentTypeModelObj.payments = paymentTypeModelObj.hasMany(paymentModelObj, {
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
  foreignKey: "paymentType",
});
paymentModelObj.paymentType = paymentModelObj.belongsTo(paymentTypeModelObj, {
  foreignKey: "paymentType",
});

invoiceModelObj.payments = invoiceModelObj.hasMany(paymentModelObj, {
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
  foreignKey: "factureId",
});
paymentModelObj.invoice = paymentModelObj.belongsTo(invoiceModelObj, {
  foreignKey: "factureId",
});

actorModelObj.invoicesReceived = actorModelObj.hasMany(invoiceModelObj, {
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
  foreignKey: "buyerId",
});
invoiceModelObj.buyer = invoiceModelObj.belongsTo(actorModelObj, {
  foreignKey: "buyerId",
  as: "buyer",
});

actorModelObj.invoicesSent = actorModelObj.hasMany(invoiceModelObj, {
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
  foreignKey: "sellerId",
});
invoiceModelObj.seller = invoiceModelObj.belongsTo(actorModelObj, {
  foreignKey: "sellerId",
  as: "seller",
});

invoiceModelObj.orders = invoiceModelObj.hasMany(orderModelObj, {
  onDelete: "SET NULL",
  onUpdate: "CASCADE",
  foreignKey: "factureId",
});
orderModelObj.invoice = orderModelObj.belongsTo(invoiceModelObj, {
  foreignKey: "factureId",
});

deviseModelObj.invoices = deviseModelObj.hasMany(invoiceModelObj, {
  onDelete: "SET NULL",
  onUpdate: "CASCADE",
  foreignKey: "deviseId",
});
invoiceModelObj.devise = invoiceModelObj.belongsTo(deviseModelObj, {
  foreignKey: "deviseId",
});

orderModelObj.services = orderModelObj.belongsToMany(serviceModelObj, {
  through: "contains",
  foreignKey: "orderId",
  onUpdate: "CASCADE",
  onDelete: "CASCADE",
  as: "Services",
});
serviceModelObj.orders = serviceModelObj.belongsToMany(orderModelObj, {
  through: "contains",
  foreignKey: "serviceId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
  as: "Orders",
});

// orderModelObj.payments = orderModelObj.hasMany(paymentModelObj, {
//   onDelete: "CASCADE",
//   onUpdate: "CASCADE",
//   foreignKey: "orderId",
// });
// paymentModelObj.order = paymentModelObj.belongsTo(orderModelObj, {
//   foreignKey: "orderId",
// });

langueModelObj.invoices = langueModelObj.hasMany(invoiceModelObj, {
  onDelete: "SET NULL",
  onUpdate: "CASCADE",
  foreignKey: "languageId",
});
invoiceModelObj.langue = invoiceModelObj.belongsTo(langueModelObj, {
  foreignKey: "languageId",
});

deviseModelObj.users = deviseModelObj.hasMany(userModelObj, {
  onDelete: "RESTRICT",
  onUpdate: "CASCADE",
  foreignKey: "deviseId",
});
userModelObj.devise = userModelObj.belongsTo(deviseModelObj, {
  foreignKey: "deviseId",
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
db.userType = userTypeModelObj;
db.actorType = actorTypeModelObj;
db.price = priceModelObj;

export default db;
