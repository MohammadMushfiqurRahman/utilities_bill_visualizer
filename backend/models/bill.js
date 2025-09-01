const { DataTypes } = require('sequelize');
const sequelize = require('../database/database');

const Bill = sequelize.define('Bill', {
  amountDue: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  dueDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  usage: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
});

module.exports = Bill;
