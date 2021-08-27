const express = require('express');
const router = express.Router();
const db = require('./db/models');

const cleanTransactions = require('./helpers/cleanTransactions');
const createTransactions = require('./helpers/createTransactions');

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
    const transactions = await db.Transaction.findAll({
      order: [['timestamp', 'ASC']],
      raw: true,
    });

    transactions.forEach((x) => {
      delete x.id;
    });

    return res.status(200).json(transactions);
  } catch (err) {
    next(err);
  }
});

router.get('/balance', async (req, res, next) => {
  try {
    const transactions = await db.Transaction.findAll();

    const payerBalanceFreq = {};

    for (let i = 0; i < transactions.length; i++) {
      if (payerBalanceFreq.hasOwnProperty(transactions[i].payer)) {
        payerBalanceFreq[transactions[i].payer] += transactions[i].points;
      } else {
        payerBalanceFreq[transactions[i].payer] = transactions[i].points;
      }
    }

    return res.status(200).json(payerBalanceFreq);
  } catch (err) {
    next(err);
  }
});

router.post('/spend', async (req, res, next) => {
  try {
    const points = req.body.points;
    const transactions = await db.Transaction.findAll({
      attributes: ['payer', 'points'],
      order: [['timestamp', 'ASC']],
      raw: true,
    });

    let totalBalance = 0;

    transactions.forEach((x) => {
      x.seen = false;
      totalBalance += x.points;
    });

    if (totalBalance < points) {
      const error = new Error(
        `Not enough points to redeem, you require an additional ${
          points - totalBalance
        } points`
      );
      error.statusCode = 405;
      throw error;
    }

    const cleanTranArr = cleanTransactions(transactions);
    const newTranArr = createTransactions(points, cleanTranArr);

    await db.Transaction.bulkCreate(newTranArr);

    return res.status(200).json(
      newTranArr.map((x) => {
        return {
          payer: x.payer,
          points: x.points,
        };
      })
    );
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
