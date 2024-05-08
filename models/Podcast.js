const { DataTypes } = require('sequelize');
const sequelize = require('../database.js');

module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Podcast', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING
    },
    description: {
      type: DataTypes.TEXT
    },
    format: {
      type: DataTypes.STRING
    },
    path_file: {
      type: DataTypes.STRING
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    likes_count: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    preview: {
      type: DataTypes.STRING
    }
  }, {
    tableName: 'podcast'
  });
};
