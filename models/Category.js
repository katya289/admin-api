const { DataTypes } = require('sequelize');
const sequelize = require('../database.js');

module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Category', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING
    },
    createdAt: {
      type: DataTypes.DATE
    },
    updatedAt: {
      type: DataTypes.DATE
    }
  }, {
    tableName: 'categories', 
  });
};
