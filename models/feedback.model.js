const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Feedback = sequelize.define(
  'Feedback',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING(100), allowNull: false },
    email: { type: DataTypes.STRING(255), allowNull: false },
    rating: { type: DataTypes.INTEGER, allowNull: false },
    comment: { type: DataTypes.TEXT, allowNull: false },
  },
  { tableName: 'feedbacks', timestamps: true }
);

module.exports = Feedback;
