const { DataTypes } = require('sequelize');
const { sequelize } = require('../configs/db');

const TenantStay = sequelize.define('TenantStay', {
  fromDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  toDate: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
}, {
  tableName: 'tenant_stays',
});

module.exports = TenantStay;
