// backend/models/Employee.js
const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize');

const Employee = sequelize.define('Employee', {
  employeeId: { type: DataTypes.INTEGER, primaryKey: true, field: 'EMPLOYEE_ID' },
  searchname: { type: DataTypes.TEXT, allowNull: false, defaultValue: '', field: 'SEARCHNAME' },
}, {
  tableName: 'employees',
  timestamps: false,
});

module.exports = Employee;