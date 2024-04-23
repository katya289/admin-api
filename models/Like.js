const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../database.js');
const User = require('./User');
const Podcast = require('./Podcast');





    const Like = sequelize.define('Like', {
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
  
   
    Like.belongsTo(Podcast, { foreignKey: 'podcast_id', onDelete: 'CASCADE' });
    Like.belongsTo(User, { foreignKey: 'user_id', onDelete: 'CASCADE' });
 
  
   
  


  module.exports = Like;
  