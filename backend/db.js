// backend/db.js
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'db',
  user: 'root',
  password: 'example',
  database: 'myapp',
  waitForConnections: true,
  connectionLimit: 10,
});

module.exports = pool;