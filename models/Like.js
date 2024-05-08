const { DataTypes } = require('sequelize');
const sequelize = require('../database.js');

module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Like', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    podcast_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    tableName: 'likes'
  });
};
