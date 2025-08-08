// backend/models/Customer.js
const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize');

const Customer = sequelize.define('Customer', {
  customerId: {
    type: DataTypes.INTEGER,
    field: 'CUSTOMER_ID',
    primaryKey: true,
    autoIncrement: true
  },
  searchname: { type: DataTypes.TEXT, field: 'SEARCHNAME', allowNull: false },
  name:       { type: DataTypes.TEXT, field: 'NAME',       allowNull: false },
  title:      { type: DataTypes.TEXT, field: 'TITLE',      allowNull: true  },
  isCompany:  { type: DataTypes.TINYINT, field: 'IS_COMPANY', allowNull: true },
  firstname:  { type: DataTypes.TEXT, field: 'FIRSTNAME',  allowNull: true  },
  companyId:  { type: DataTypes.INTEGER, field: 'COMPANY_ID', allowNull: true },
  classification: { type: DataTypes.TEXT, field: 'CLASSIFICATION', allowNull: true },
  street1:    { type: DataTypes.TEXT, field: 'STREET1',    allowNull: true  },
  street2:    { type: DataTypes.TEXT, field: 'STREET2',    allowNull: true  },
  street3:    { type: DataTypes.TEXT, field: 'STREET3',    allowNull: true  },
  postalcode: { type: DataTypes.TEXT, field: 'POSTALCODE', allowNull: true  },
  city:       { type: DataTypes.TEXT, field: 'CITY',       allowNull: true  },
  phone:      { type: DataTypes.TEXT, field: 'PHONE',      allowNull: true  },
  email:      { type: DataTypes.TEXT, field: 'EMAIL',      allowNull: true  },
  salutation: { type: DataTypes.TEXT, field: 'SALUTATION', allowNull: true  },
  contact:    { type: DataTypes.TEXT, field: 'CONTACT',    allowNull: true  }
}, {
  tableName: 'customers',
  timestamps: false
});

module.exports = Customer;