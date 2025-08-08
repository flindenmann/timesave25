// backend/sequelize.js
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME || 'myapp',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || 'example',
  {
    host: process.env.DB_HOST || 'db',
    dialect: 'mysql',
    logging: false, // bei Bedarf true für SQL-Logs
    define: {
      // globale Defaults:
      timestamps: false,     // deine Tabellen haben keine createdAt/updatedAt
      underscored: false     // wir mappen Felder explizit (siehe Model)
    }
  }
);

module.exports = sequelize;