'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('podcast', 'likes_count', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0
    });

    await queryInterface.addColumn('podcast', 'preview', {
      type: Sequelize.STRING,
      allowNull: true
    })
    // await queryInterface.addColumn('podcast', 'comments_count', {
    //   type: Sequelize.INTEGER,
    //   allowNull: false,
    //   defaultValue: 0
    // });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('podcast', 'likes_count');
    // await queryInterface.removeColumn('podcast', 'comments_count');
    await queryInterface.removeColumn('podcast', 'preview');
  }
};
