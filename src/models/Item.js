const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Item = sequelize.define('Item', {
  productId: { type: DataTypes.STRING },
  quantity: { type: DataTypes.INTEGER },
  price: { type: DataTypes.FLOAT },
  orderId: { type: DataTypes.STRING }
}, { tableName: 'Items', timestamps: false });

module.exports = Item;