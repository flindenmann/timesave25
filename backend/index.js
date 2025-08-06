const express = require('express');
const mysql = require('mysql2');
const app = express();
const port = 5000;

// DB-Verbindung aufbauen
const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'myapp',
});

db.connect((err) => {
  if (err) {
    console.error('MySQL Verbindung fehlgeschlagen:', err);
    return;
  }
  console.log('✅ MySQL verbunden');
});

// Test-Route
app.get('/', (req, res) => {
  res.send('Backend läuft!');
});

app.listen(port, () => {
  console.log(`🚀 Backend auf http://localhost:${port}`);
});