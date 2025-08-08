// backend/models/index.js
const Customer   = require('./Customer');
const Contract   = require('./Contract');
const ContractPos= require('./ContractPos');

Contract.hasMany(ContractPos, { foreignKey: 'contractId', sourceKey: 'contractId' });
ContractPos.belongsTo(Contract, { foreignKey: 'contractId', targetKey: 'contractId' });

// falls gebraucht: Customer 1—n Contracts
Customer.hasMany(Contract, { foreignKey: 'customerId', sourceKey: 'customerId' });
Contract.belongsTo(Customer, { foreignKey: 'customerId', targetKey: 'customerId' });

module.exports = { Customer, Contract, ContractPos };