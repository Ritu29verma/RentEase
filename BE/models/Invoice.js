const { DataTypes } = require('sequelize');
const { sequelize } = require('../configs/db');

const Invoice = sequelize.define('Invoice', {
  invoiceNo: {
    type: DataTypes.STRING,
    unique: true,
  },
  transactionId: {
    type: DataTypes.STRING,
  },
  amount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('Pending', 'Paid', 'Failed'),
    defaultValue: 'Pending',
  },
  fromDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  toDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
}, {
  tableName: 'invoices',
});

module.exports = Invoice;
