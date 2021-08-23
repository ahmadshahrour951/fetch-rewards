'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {
    static associate(models) {
      Transaction.belongsTo(models.User);
      Transaction.belongsTo(models.Payer);
    }
  }
  Transaction.init(
    {
      points: DataTypes.INTEGER,
      timestamp: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: 'Transaction',
      underscored: true
    }
  );
  return Transaction;
};
