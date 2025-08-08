// backend/db.js
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'db',
  user: 'root',
  password: 'example',
  database: 'timesave25',
  waitForConnections: true,
  connectionLimit: 10,
});

module.exports = pool;