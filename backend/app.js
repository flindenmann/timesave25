// backend/app.js
const express = require('express');
const customersRouter = require('./routes/customers');
const contractsRouter   = require('./routes/contracts');
const contractposRouter = require('./routes/contractpos');
const employeesRouter   = require('./routes/employees');
const costcentersRouter = require('./routes/costcenters');

const app = express();

// --- Minimal CORS ohne externes Paket ---
const allowed = new Set(['http://localhost:3000', 'http://127.0.0.1:3000']);
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (!origin || allowed.has(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin || '*');
  }
  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});
// --- /Minimal CORS ---

app.use(express.json());

app.use('/api/customers', customersRouter);
app.use('/api/contracts', contractsRouter);
app.use('/api/contractpos', contractposRouter);
app.use('/api/employees', require('./routes/employees'));
app.use('/api/costcenters', require('./routes/costcenters'));
app.use('/api/employees', employeesRouter);
app.use('/api/costcenters', costcentersRouter);

app.get('/healthz', (_req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend läuft auf http://localhost:${PORT}`));