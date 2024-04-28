const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../database.js');
const Podcast = require('./Podcast.js');

const Category = sequelize.define('Category', {
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
},
{
    tableName: 'categories', 
});

// Category.hasMany(Podcast, { foreignKey: 'categoryId', as: 'Podcast'})


module.exports = Category;
