// backend/routes/customers.js
console.log('>>> customers.js (Sequelize) geladen');
const express = require('express');
const router = express.Router();
const Customer = require('../models/Customer');

// Mapping: API (UPPERCASE) -> Model (camelCase)
const API_TO_MODEL = {
  SEARCHNAME: 'searchname',
  NAME: 'name',
  TITLE: 'title',
  IS_COMPANY: 'isCompany',
  FIRSTNAME: 'firstname',
  COMPANY_ID: 'companyId',
  CLASSIFICATION: 'classification',
  STREET1: 'street1',
  STREET2: 'street2',
  STREET3: 'street3',
  POSTALCODE: 'postalcode',
  CITY: 'city',
  PHONE: 'phone',
  EMAIL: 'email',
  SALUTATION: 'salutation',
  CONTACT: 'contact',
};

function mapApiBodyToModel(body) {
  const obj = {};
  for (const [apiKey, modelKey] of Object.entries(API_TO_MODEL)) {
    if (Object.prototype.hasOwnProperty.call(body, apiKey)) {
      // Null statt undefined speichern → MySQL erlaubt NULL
      obj[modelKey] = body[apiKey] ?? null;
    }
  }
  return obj;
}

// Alle Kunden abrufen (alle Spalten)
router.get('/', async (_req, res) => {
  try {
    const rows = await Customer.findAll({
      raw: true, // plain JS-Objekte
      order: [['customerId', 'ASC']], // *** korrektes Sequelize-Attribut ***
    });
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Kunden erstellen
router.post('/', async (req, res) => {
  try {
    if (!req.body?.SEARCHNAME || !req.body?.NAME) {
      return res.status(400).json({ error: 'SEARCHNAME und NAME sind Pflichtfelder' });
    }
    const payload = mapApiBodyToModel(req.body);
    const created = await Customer.create(payload);
    res.status(201).json({ id: created.customerId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Kunden aktualisieren (nur übergebene Felder)
router.put('/:id', async (req, res) => {
  try {
    const payload = mapApiBodyToModel(req.body);
    if (Object.keys(payload).length === 0) {
      return res.status(400).json({ error: 'Keine gültigen Felder zum Aktualisieren' });
    }

    const [count] = await Customer.update(payload, {
      where: { customerId: req.params.id },
    });

    if (count === 0) return res.status(404).json({ error: 'Not found' });
    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Kunden löschen
router.delete('/:id', async (req, res) => {
  try {
    const count = await Customer.destroy({ where: { customerId: req.params.id } });
    if (count === 0) return res.status(404).json({ error: 'Not found' });
    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;