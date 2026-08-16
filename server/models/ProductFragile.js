const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ProductFragile = sequelize.define('ProductFragile', {
  productId: {
    type: DataTypes.UUID,
    primaryKey: true,
    references: {
      model: 'Products',
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  handlingNote: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  isFragile: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  }
});

module.exports = ProductFragile;
