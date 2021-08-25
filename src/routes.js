const express = require('express');
const router = express.Router();
const db = require('./db/models');

router.post('/transactions', async (req, res, next) => {
  try {
    const { payer, points, timestamp } = req.body;
    await db.Transaction.create({
      payer,
      points,
      timestamp,
    });
    return res.status(201);
  } catch (err) {
    next(err);
  }
});

router.get('/transactions', async (req, res, next) => {
  try {
    const transactions = await db.Transaction.findAll({});
    return res.status(200).json(transactions);
  } catch (err) {
    next(err);
  }
});


router.use((error, req, res, next) => {});
router.use((req, res, next) => {});

module.exports = router;
