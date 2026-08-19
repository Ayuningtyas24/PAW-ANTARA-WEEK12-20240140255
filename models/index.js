const sequelize = require('../config/database');
const User = require('./user.model');
const Product = require('./product.model');

module.exports = { sequelize, User, Product };
