'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('podcast', 'likes_count');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('podcast', 'likes_count', {
      type: Sequelize.INTEGER,
      defaultValue: 0
    });
  }
};
