// backend/routes/contracts.js
const express = require('express');
const router = express.Router();
const { Contract, ContractPos } = require('../models');

// API (UPPERCASE) -> Model (camelCase)
const MAP = {
  CUSTOMER_ID: 'customerId',
  NAME: 'name',
  SEARCHNAME: 'searchname',
  STATUS: 'status',
  CLASSIFICATION: 'classification',
  CONDITIONSTEXT: 'conditionstext',
  TEXT1: 'text1',
  TEXT2: 'text2',
  FEEKILOMETER: 'feekilometer',
  FEETRAVEL: 'feetravel',
  MWST: 'mwst',
  FILE: 'file',
  AMOUNTBUDGET: 'amountbudget',
  AMOUNTBUDGET_STD: 'amountbudgetStd',
  AMOUNTCURRENT_STD: 'amountcurrentStd',
};

const toModel = (body) =>
  Object.fromEntries(
    Object.entries(MAP)
      .filter(([apiKey]) => apiKey in body)
      .map(([apiKey, modelKey]) => [modelKey, body[apiKey] ?? null])
  );

// GET /api/contracts?customerId=123&withPos=1
router.get('/', async (req, res) => {
  try {
    const where = {};
    if (req.query.customerId) where.customerId = Number(req.query.customerId);

    const withPos =
      req.query.withPos === '1' ||
      req.query.withPos === 'true' ||
      req.query.withPos === true;

    const rows = await Contract.findAll({
      where,
      include: withPos ? [{ model: ContractPos }] : [],
      order: [['contractId', 'DESC']], // Sequelize-Attributname!
    });

    res.json(rows);
  } catch (e) {
    console.error('GET /contracts failed:', e);
    res.status(500).json({ error: e.message });
  }
});

// GET /api/contracts/:id
router.get('/:id', async (req, res) => {
  try {
    const row = await Contract.findByPk(req.params.id, {
      include: [{ model: ContractPos }],
    });
    if (!row) return res.status(404).json({ error: 'Not found' });
    res.json(row);
  } catch (e) {
    console.error('GET /contracts/:id failed:', e);
    res.status(500).json({ error: e.message });
  }
});

// POST /api/contracts
router.post('/', async (req, res) => {
  try {
    // minimale Pflichtfelder laut deinem Schema (anpassen, falls nötig)
    if (!req.body?.CUSTOMER_ID || !req.body?.NAME || !req.body?.SEARCHNAME) {
      return res
        .status(400)
        .json({ error: 'CUSTOMER_ID, NAME, SEARCHNAME sind Pflichtfelder' });
    }

    // Defaults für NOT NULL-Textfelder, falls nicht mitgeschickt
    const withDefaults = {
      STATUS: req.body.STATUS ?? '',
      CLASSIFICATION: req.body.CLASSIFICATION ?? '',
      CONDITIONSTEXT: req.body.CONDITIONSTEXT ?? '',
      TEXT1: req.body.TEXT1 ?? '',
      TEXT2: req.body.TEXT2 ?? '',
      ...req.body,
    };

    const created = await Contract.create(toModel(withDefaults));
    res.status(201).json({ id: created.contractId });
  } catch (e) {
    console.error('POST /contracts failed:', e);
    res.status(500).json({ error: e.message });
  }
});

// PUT /api/contracts/:id  (nur übergebene Felder)
router.put('/:id', async (req, res) => {
  try {
    const payload = toModel(req.body);
    if (Object.keys(payload).length === 0) {
      return res.status(400).json({ error: 'Keine Felder' });
    }

    const [count] = await Contract.update(payload, {
      where: { contractId: req.params.id },
    });
    if (count === 0) return res.status(404).json({ error: 'Not found' });

    res.sendStatus(204);
  } catch (e) {
    console.error('PUT /contracts/:id failed:', e);
    res.status(500).json({ error: e.message });
  }
});

// DELETE /api/contracts/:id
router.delete('/:id', async (req, res) => {
  try {
    const count = await Contract.destroy({
      where: { contractId: req.params.id },
    });
    if (count === 0) return res.status(404).json({ error: 'Not found' });
    res.sendStatus(204);
  } catch (e) {
    console.error('DELETE /contracts/:id failed:', e);
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;