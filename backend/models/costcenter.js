// backend/models/Costcenter.js
const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize');

const Costcenter = sequelize.define('Costcenter', {
  costcenterId: { type: DataTypes.INTEGER, primaryKey: true, field: 'COSTCENTER_ID' },
  searchname:   { type: DataTypes.TEXT, allowNull: false, defaultValue: '', field: 'SEARCHNAME' },
}, {
  tableName: 'costcenters',
  timestamps: false,
});

module.exports = Costcenter;