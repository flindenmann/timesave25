const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize');

const Contract = sequelize.define('Contract', {
  contractId:       { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, field: 'CONTRACT_ID' },
  customerId:       { type: DataTypes.INTEGER, allowNull: false, field: 'CUSTOMER_ID' },

  name:             { type: DataTypes.TEXT,    allowNull: false, defaultValue: '', field: 'NAME' },
  searchname:       { type: DataTypes.TEXT,    allowNull: false, defaultValue: '', field: 'SEARCHNAME' },
  status:           { type: DataTypes.TEXT,    allowNull: false, defaultValue: '', field: 'STATUS' },
  classification:   { type: DataTypes.TEXT,    allowNull: false, defaultValue: '', field: 'CLASSIFICATION' },
  conditionstext:   { type: DataTypes.STRING(512), allowNull: false, defaultValue: '', field: 'CONDITIONSTEXT' },
  text1:            { type: DataTypes.STRING(512), allowNull: false, defaultValue: '', field: 'TEXT1' },
  text2:            { type: DataTypes.STRING(512), allowNull: false, defaultValue: '', field: 'TEXT2' },

  feekilometer:     { type: DataTypes.FLOAT,   allowNull: false, defaultValue: 0, field: 'FEEKILOMETER' },
  feetravel:        { type: DataTypes.FLOAT,   allowNull: false, defaultValue: 0, field: 'FEETRAVEL' },
  mwst:             { type: DataTypes.DOUBLE,  allowNull: false, defaultValue: 0.081, field: 'MWST' },

  file:             { type: DataTypes.TEXT,    allowNull: true, field: 'FILE' },

  amountbudget:     { type: DataTypes.DOUBLE,  allowNull: false, defaultValue: 0, field: 'AMOUNTBUDGET' },
  amountbudgetStd:  { type: DataTypes.FLOAT,   allowNull: false, defaultValue: 0, field: 'AMOUNTBUDGET_STD' },
  amountcurrentStd: { type: DataTypes.FLOAT,   allowNull: false, defaultValue: 0, field: 'AMOUNTCURRENT_STD' },
}, {
  tableName: 'contracts',
  timestamps: false,
});

module.exports = Contract;