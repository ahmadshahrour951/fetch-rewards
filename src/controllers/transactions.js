const db = require('../db/models');

const checkBalance = require('../helpers/checkBalance')
const cleanTransactions = require('../helpers/cleanTransactions');
const createTransactions = require('../helpers/createTransactions');

const getTransactions = async (req, res, next) => {
  /**
   * This simply finds all transactions in the database and returns them.
   */
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
};

const earnTransaction = async (req, res, next) => {
  /**
   * Create a new positive transaction to add to the database.
   */
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
};

const spendTransaction = async (req, res, next) => {
  /**
   * Create a new negative transactions to add to the database.
   * 
   * This function is the main function that the description is asking to solve for. We sort the transactions, then clean it up
   * to an array of consumable transactions, then we consume them and return.
   */
  try {
    const points = req.body.points;
    const transactions = await db.Transaction.findAll({
      attributes: ['payer', 'points'],
      order: [['timestamp', 'ASC']],
      raw: true,
    });
    transactions.forEach((x) => {
      x.seen = false;
    });

    checkBalance(points, transactions);
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
};

const getBalance = async (req, res, next) => {
  /**
   * This simply returns the balance of each payer using the transactions table.
   */
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
};

module.exports = {
  getTransactions,
  earnTransaction,
  spendTransaction,
  getBalance,
};
