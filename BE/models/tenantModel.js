const { DataTypes } = require('sequelize');
const sequelize = require('../configs/db');

const Tenant = sequelize.define('Tenant', {
  name: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
  email: { 
    type: DataTypes.STRING, 
    allowNull: false, 
    unique: true,
  },
  mobile: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
  password: { 
    type: DataTypes.STRING, 
    allowNull: true 
  },
}, {
  tableName: 'tenants',
});

module.exports = Tenant;
