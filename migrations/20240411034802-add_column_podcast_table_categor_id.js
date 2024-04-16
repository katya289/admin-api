'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Добавляем поле categoryId в таблицу "Подкасты"
    await queryInterface.addColumn('podcast', 'categoryId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'categories', // Указываем на таблицу "Categories"
        key: 'id' // Указываем на колонку с которой мы связываемся
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });

    // Удаляем поле category из таблицы "Подкасты"
    await queryInterface.removeColumn('podcast', 'category');
  },

  down: async (queryInterface, Sequelize) => {
    // Добавляем обратно поле category в таблицу "Подкасты"
    await queryInterface.addColumn('podcast', 'category', {
      type: Sequelize.STRING,
      allowNull: false
    });

    // Удаляем поле categoryId из таблицы "Подкасты"
    await queryInterface.removeColumn('podcast', 'categoryId');
  }
};
