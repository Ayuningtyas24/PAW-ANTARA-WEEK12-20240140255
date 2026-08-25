const sequelize = require('../config/database');
const User = require('./user.model');
const Product = require('./product.model');
const Feedback = require('./feedback.model');

module.exports = { sequelize, User, Product, Feedback };

