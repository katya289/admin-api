const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../database.js');
const User = require('./User');

const Podcast = sequelize.define('Podcast', {
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
    }
},
{
    tableName: 'podcast'
});


Podcast.belongsTo(User, { foreignKey: 'userId', onDelete: 'CASCADE' });

module.exports = Podcast;
