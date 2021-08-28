const { body } = require('express-validator');

const validate = (method) => {
  /**
   * This sets the rules for body validation for the routes.
   */
  switch (method) {
    case 'earnTransaction':
      return [
        body('payer')
          .exists()
          .bail()
          .isString()
          .withMessage("'payer' must be a string")
          .bail(),
        body('points')
          .exists()
          .bail()
          .isInt({ gt: 0 })
          .withMessage("'points' must be greater than zero")
          .bail(),
        body('timestamp')
          .exists()
          .bail()
          .isISO8601()
          .withMessage("'timestamp' must be a date with ISO8601 standards.")
          .bail()
          .toDate(),
      ];
    case 'spendTransaction':
      return [
        body('points')
          .exists()
          .bail()
          .isInt({ gt: 0 })
          .withMessage("'points' must be greater than zero")
          .bail(),
      ];
    default:
      return [];
  }
};

module.exports = validate;
