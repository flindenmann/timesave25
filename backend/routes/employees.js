// backend/routes/employees.js
const express = require('express');
const router = express.Router();
const Employees = require('../models/Employee');
const { Op } = require('sequelize');

// GET /api/employees?q=smith
router.get('/', async (req, res) => {
  try {
    const where = {};
    const q = (req.query.q || '').trim();
    if (q) where.searchname = { [Op.like]: `%${q}%` };

    const rows = await Employees.findAll({
      where,
      attributes: ['employeeId', 'searchname'],
      order: [['searchname', 'ASC']],
      raw: true,
    });

    // Normiertes Lookup-Format
    res.json(rows.map(r => ({ id: r.employeeId, name: r.searchname })));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;