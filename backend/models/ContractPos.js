const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize');

const ContractPos = sequelize.define('ContractPos', {
  contractposId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, field: 'CONTRACTPOS_ID' },
  contractId:    { type: DataTypes.INTEGER, allowNull: false, field: 'CONTRACT_ID' },
  employeeId:    { type: DataTypes.INTEGER, allowNull: false, field: 'EMPLOYEE_ID' },
  costcenterId:  { type: DataTypes.INTEGER, allowNull: false, field: 'COSTCENTER_ID' },

  text:          { type: DataTypes.TEXT,     allowNull: false, defaultValue: '', field: 'TEXT' },
  datestart:     { type: DataTypes.DATEONLY, allowNull: false, field: 'DATESTART' },
  dateend:       { type: DataTypes.DATEONLY, allowNull: false, field: 'DATEEND' },

  quantity:      { type: DataTypes.DECIMAL(11,0), allowNull: false, field: 'QUANTITY' },
  unit:          { type: DataTypes.TEXT,          allowNull: false, defaultValue: '', field: 'UNIT' },
  rate:          { type: DataTypes.DECIMAL(10,0), allowNull: false, field: 'RATE' },
  amount:        { type: DataTypes.DECIMAL(10,0), allowNull: false, field: 'AMOUNT' },
  vat:           { type: DataTypes.DECIMAL(10,4), allowNull: false, field: 'VAT' },
}, {
  tableName: 'contractpos',
  timestamps: false,
});

module.exports = ContractPos;