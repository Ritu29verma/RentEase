// models/RentSchedule.js
const { DataTypes } = require('sequelize');
const {sequelize} = require('../configs/db');

const RentSchedule = sequelize.define('RentSchedule', {
  month: { type: DataTypes.STRING, allowNull: false },
  dueDate: { type: DataTypes.DATEONLY, allowNull: false },
  status: {
    type: DataTypes.ENUM('Paid', 'Pending'),
    allowNull: false,
    defaultValue: 'Pending',
  },
}, {
  tableName: 'rent_schedules',
});

module.exports = RentSchedule;
