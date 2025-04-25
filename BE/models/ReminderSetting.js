const { DataTypes } = require('sequelize');
const { sequelize } = require('../configs/db');

const ReminderSetting = sequelize.define('ReminderSetting', {
  daysBeforeDue: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
  },
  sendViaEmail: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  sendViaSMS: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  timeToSend: {
    type: DataTypes.TIME,
    allowNull: false,
    defaultValue: '00:00:00',
  },
}, {
  tableName: 'reminder_settings',
});

module.exports = { ReminderSetting };
