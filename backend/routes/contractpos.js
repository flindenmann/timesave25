const express = require('express');
const router = express.Router();
const ContractPos = require('../models/ContractPos');

const MAP = {
  CONTRACT_ID:'contractId', EMPLOYEE_ID:'employeeId', COSTCENTER_ID:'costcenterId',
  TEXT:'text', DATESTART:'datestart', DATEEND:'dateend',
  QUANTITY:'quantity', UNIT:'unit', RATE:'rate', AMOUNT:'amount', VAT:'vat',
};
const toModel = (b)=>Object.fromEntries(Object.entries(MAP).filter(([k])=>k in b).map(([k,v])=>[v, b[k] ?? null]));

// GET /api/contractpos?contractId=
router.get('/', async (req, res) => {
  try {
    const where = {};
    if (req.query.contractId) where.contractId = req.query.contractId;
    const rows = await ContractPos.findAll({ where, order: [['contractposId','ASC']] });
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// POST
router.post('/', async (req, res) => {
  try {
    const required = ['CONTRACT_ID','EMPLOYEE_ID','COSTCENTER_ID','TEXT','DATESTART','DATEEND','QUANTITY','UNIT','RATE','AMOUNT','VAT'];
    for (const key of required) if (!(key in req.body)) return res.status(400).json({ error: `Feld ${key} fehlt` });
    const created = await ContractPos.create(toModel(req.body));
    res.status(201).json({ id: created.contractposId });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// PUT /api/contractpos/:id
router.put('/:id', async (req, res) => {
  try {
    const payload = toModel(req.body);
    if (Object.keys(payload).length === 0) return res.status(400).json({ error: 'Keine Felder' });
    const [count] = await ContractPos.update(payload, { where: { contractposId: req.params.id } });
    if (count === 0) return res.status(404).json({ error: 'Not found' });
    res.sendStatus(204);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// DELETE /api/contractpos/:id
router.delete('/:id', async (req, res) => {
  try {
    const count = await ContractPos.destroy({ where: { contractposId: req.params.id } });
    if (count === 0) return res.status(404).json({ error: 'Not found' });
    res.sendStatus(204);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;