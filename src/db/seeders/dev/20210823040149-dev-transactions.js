'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('transactions', [
      {
        id: 1,
        points: 1000,
        timestamp: new Date('2020-11-02T14:00:00Z'),
        user_id: 1,
        payer_id: 1,
      },
      {
        id: 2,
        points: 200,
        timestamp: new Date('2020-10-31T11:00:00Z'),
        user_id: 1,
        payer_id: 2,
      },
      {
        id: 3,
        points: -200,
        timestamp: new Date('2020-10-31T15:00:00Z'),
        user_id: 1,
        payer_id: 1,
      },
      {
        id: 4,
        points: 10000,
        timestamp: new Date('2020-11-01T14:00:00Z'),
        user_id: 1,
        payer_id: 3,
      },
      {
        id: 5,
        points: 300,
        timestamp: new Date('2020-10-31T10:00:00Z'),
        user_id: 1,
        payer_id: 1,
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('transactions', null, {});
  },
};
