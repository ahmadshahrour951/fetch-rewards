'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('payers', [
      {
        id: 1,
        name: 'DANNON',
      },
      {
        id: 2,
        name: 'UNILEVER',
      },
      {
        id: 3,
        name: 'MILLER COORS',
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('payers', null, {});
  },
};
