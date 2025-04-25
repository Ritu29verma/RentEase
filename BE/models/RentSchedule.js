// models/RentSchedule.js
const { DataTypes } = require('sequelize');
const {sequelize} = require('../configs/db');

const RentSchedule = sequelize.define('RentSchedule', {
  month: { type: DataTypes.STRING, allowNull: false },
  dueDate: { type: DataTypes.DATEONLY, allowNull: false },
  amount: { type: DataTypes.INTEGER, allowNull: false }, 
  status: {
    type: DataTypes.ENUM('Paid', 'Pending'),
    allowNull: false,
    defaultValue: 'Pending',
  },
  reminderSent: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  }
}, {
  tableName: 'rent_schedules',
});

module.exports = RentSchedule;
