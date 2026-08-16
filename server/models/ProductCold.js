const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ProductCold = sequelize.define('ProductCold', {
  productId: {
    type: DataTypes.UUID,
    primaryKey: true,
    references: {
      model: 'Products',
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  expiryDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  storageTemp: {
    type: DataTypes.STRING,
    allowNull: true,
  }
});

module.exports = ProductCold;
