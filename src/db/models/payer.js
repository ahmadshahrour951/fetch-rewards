'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Payer extends Model {
    static associate(models) {
      Payer.hasMany(models.Transaction);
    }
  }
  Payer.init(
    {
      name: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'Payer',
      underscored: true
    }
  );
  return Payer;
};
