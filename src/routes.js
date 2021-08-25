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

router.get('/balance', async (req, res, next) => {
  try {
    const transactions = await db.Transaction.findAll({
      order: [['timestamp', 'ASC']],
    });

    const payerFreq = {};

    for (let transaction of transactions) {
      if (payerFreq.hasOwnProperty(transaction.payer)) {
        payerFreq[transaction.payer] += transaction.points;
      } else {
        payerFreq[transaction.payer] = transaction.points;
      }
    }

    return res.status(200).json(payerFreq);
  } catch (err) {
    next(err);
  }
});

router.patch('/spend', async (req, res, next) => {
  try {
    const now = new Date();
    const points = req.body.points;
    const transactions = await db.Transaction.findAll({
      order: [['timestamp', 'ASC']],
    });

    let pointsLeft = points;
    let payerDeductions = {};

    for (let transaction of transactions) {
      if (pointsLeft <= 0) break;

      const subtractNum =
        pointsLeft - transaction.points < 0 ? pointsLeft : transaction.points;

      if (payerDeductions.hasOwnProperty(transaction.payer)) {
        payerDeductions[transaction.payer] -= subtractNum;
      } else {
        payerDeductions[transaction.payer] = -subtractNum;
      }

      pointsLeft -= transaction.points;
    }

    if (pointsLeft > 0) {
      const error = new Error(
        `Not enough points to claim. You require an additional ${pointsLeft} points`
      );
      error.statusCode = 500;
      throw error;
    }

    let newTransactions = [];

    for (let payer in payerDeductions) {
      newTransactions.push({
        payer,
        points: payerDeductions[payer],
      });

      await db.Transaction.create({
        payer,
        points: payerDeductions[payer],
        timestamp: now,
      });
    }

    return res.status(200).json(newTransactions);
  } catch (err) {
    next(err);
  }
});

router.use((error, req, res, next) =>
  res.status(error.statusCode || 500).json({
    message: error.message || 'Internal Server Error',
    data: error.data || null,
  })
);

router.use((req, res) =>
  res.status(404).json({ message: 'API endpoint not found.' })
);

module.exports = router;
