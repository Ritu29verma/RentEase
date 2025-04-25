const { DataTypes } = require('sequelize');
const { sequelize } = require('../configs/db');

const GeneralSetting = sequelize.define('GeneralSetting', {
  platformName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  supportEmail: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: 'general_settings',
});

module.exports = {GeneralSetting};
