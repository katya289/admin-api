const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../database.js');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING
    },
    email: {
        type: DataTypes.STRING
    },
    
    password: {
        type: DataTypes.STRING
    },
    remember_token: {
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
    tableName: 'user',
    
}, );

module.exports = User;
