'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('transactions', [
      {
        id: 1,
        payer: 'DANNON',
        points: 1000,
        timestamp: new Date('2020-11-02T14:00:00Z'),
      },
      {
        id: 2,
        payer: 'UNILEVER',
        points: 200,
        timestamp: new Date('2020-10-31T11:00:00Z'),
      },
      {
        id: 3,
        payer: 'DANNON',
        points: -200,
        timestamp: new Date('2020-10-31T15:00:00Z'),
      },
      {
        id: 4,
        payer: 'MILLER COORS',
        points: 10000,
        timestamp: new Date('2020-11-01T14:00:00Z'),
      },
      {
        id: 5,
        payer: 'DANNON',
        points: 300,
        timestamp: new Date('2020-10-31T10:00:00Z'),
      },
    ]);

    await queryInterface.sequelize.query(
      "SELECT SETVAL('transactions_id_seq', (SELECT MAX(id) FROM transactions));"
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('transactions', null, {});
  },
};
