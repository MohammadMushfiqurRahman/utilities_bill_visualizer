const { DataTypes } = require('sequelize');
const sequelize = require('../database/database');

const Bill = sequelize.define('Bill', {
  vendorName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  billDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  dueDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  totalAmount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  usageValue: {
    type: DataTypes.FLOAT,
  },
  usageUnit: {
    type: DataTypes.STRING,
  },
  accountNumber: {
    type: DataTypes.STRING,
  },
  apartment: {
    type: DataTypes.STRING,
  },
  breakdown: {
    type: DataTypes.JSON,
  },
});

module.exports = Bill;
