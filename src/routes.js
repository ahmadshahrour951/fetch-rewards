const express = require('express');
const router = express.Router();

const validate = require('./middlewares/validate');
const validateRules = require('./middlewares/validateResult');
const {
  getTransactions,
  earnTransaction,
  spendTransaction,
  getBalance,
} = require('./controllers/transactions');
const { generalError, notFoundError } = require('./controllers/errors');

router.get('/', getTransactions);
router.post(
  '/earn',
  validate('earnTransaction'),
  validateRules,
  earnTransaction
);
router.post(
  '/spend',
  validate('spendTransaction'),
  validateRules,
  spendTransaction
);
router.get('/balance', getBalance);

router.use(generalError);
router.use(notFoundError);

module.exports = router;
