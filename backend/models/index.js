const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};
const User = require('./user');
const Seller = require('./seller');
const Room=require("./room");
const Image=require("./image");
const Option=require("./option");

const sequelize = new Sequelize(config.database, config.username, config.password, config);

db.sequelize = sequelize;

db.User=User;
db.Seller=Seller;
db.Room=Room;
db.Image=Image;
db.Option=Option;

User.init(sequelize);
Seller.init(sequelize);
Room.init(sequelize);
Image.init(sequelize);
Option.init(sequelize);

Seller.associate(db);
Room.associate(db);
Image.associate(db);
Option.associate(db);

module.exports = db;
