const { DataTypes } = require('sequelize');
const { sequelize } = require('../configs/db');

const BillingSetting = sequelize.define('BillingSetting', {
  defaultRentFrequency: {
    type: DataTypes.ENUM('Monthly', 'Quarterly'),
    defaultValue: 'Monthly',
  },
  invoicePrefix: {
    type: DataTypes.STRING,
    defaultValue: 'INV-',
  },
  gracePeriodDays: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
}, {
  tableName: 'billing_settings',
});

module.exports = {BillingSetting};
