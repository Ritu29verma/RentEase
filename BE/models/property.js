// models/Property.js
const { DataTypes } = require('sequelize');
const {sequelize} = require('../configs/db');

const Property = sequelize.define('Property', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  rent: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  frequency: {
    type: DataTypes.ENUM('Monthly', 'Quarterly'),
    allowNull: false,
    defaultValue: 'Monthly',
  },
}, {
  tableName: 'properties',
});

module.exports = Property;
