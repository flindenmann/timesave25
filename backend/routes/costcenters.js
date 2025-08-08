// backend/routes/costcenters.js
const express = require('express');
const router = express.Router();
const Costcenters = require('../models/Costcenter');
const { Op } = require('sequelize');

// GET /api/costcenters?q=it
router.get('/', async (req, res) => {
  try {
    const where = {};
    const q = (req.query.q || '').trim();
    if (q) where.searchname = { [Op.like]: `%${q}%` };

    const rows = await Costcenters.findAll({
      where,
      attributes: ['costcenterId', 'searchname'],
      order: [['searchname', 'ASC']],
      raw: true,
    });

    res.json(rows.map(r => ({ id: r.costcenterId, name: r.searchname })));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;