console.log(">> app.js gestartet");
// backend/app.js
const express = require('express');
const app = express();
const customersRouter = require('./routes/customers');
const sequelize = require('./sequelize');

app.use(express.json());
app.use('/api/customers', customersRouter);

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Sequelize: Verbindung steht.');
  } catch (e) {
    console.error('Sequelize: Verbindung fehlgeschlagen:', e.message);
  }
})();

app.listen(5000, '0.0.0.0', () => console.log('Backend läuft auf http://0.0.0.0:5000'));