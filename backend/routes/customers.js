// backend/routes/customers.js
console.log('>>> customers.js (Sequelize) geladen');
const express = require('express');
const router = express.Router();
const Customer = require('../models/Customer');

// Alle Kunden abrufen
router.get('/', async (req, res) => {
  try {
    const rows = await Customer.findAll({
      raw: true,            // gibt plain JS-Objekte zurück, kein Sequelize-Wrapper
      order: [['CUSTOMER_ID', 'ASC']]
    });
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Kunden erstellen
router.post('/', async (req, res) => {
  try {
    const created = await Customer.create({
      searchname: req.body.SEARCHNAME,
      name: req.body.NAME,
      title: req.body.TITLE ?? null,
      isCompany: req.body.IS_COMPANY ?? 0,
      firstname: req.body.FIRSTNAME ?? null,
      companyId: req.body.COMPANY_ID ?? null,
      classification: req.body.CLASSIFICATION ?? null,
      street1: req.body.STREET1 ?? null,
      street2: req.body.STREET2 ?? null,
      street3: req.body.STREET3 ?? null,
      postalcode: req.body.POSTALCODE ?? null,
      city: req.body.CITY ?? null,
      phone: req.body.PHONE ?? null,
      email: req.body.EMAIL ?? null,
      salutation: req.body.SALUTATION ?? null,
      contact: req.body.CONTACT ?? null
    });
    res.status(201).json({ id: created.customerId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Kunden aktualisieren
router.put('/:id', async (req, res) => {
  try {
    const [count] = await Customer.update({
      searchname: req.body.SEARCHNAME,
      name: req.body.NAME,
      title: req.body.TITLE,
      isCompany: req.body.IS_COMPANY,
      firstname: req.body.FIRSTNAME,
      companyId: req.body.COMPANY_ID,
      classification: req.body.CLASSIFICATION,
      street1: req.body.STREET1,
      street2: req.body.STREET2,
      street3: req.body.STREET3,
      postalcode: req.body.POSTALCODE,
      city: req.body.CITY,
      phone: req.body.PHONE,
      email: req.body.EMAIL,
      salutation: req.body.SALUTATION,
      contact: req.body.CONTACT
    }, {
      where: { customerId: req.params.id }
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