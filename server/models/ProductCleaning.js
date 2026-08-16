const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ProductCleaning = sequelize.define('ProductCleaning', {
  productId: {
    type: DataTypes.UUID,
    primaryKey: true,
    references: {
      model: 'Products',
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  isHazardous: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  safetyNote: {
    type: DataTypes.TEXT,
    allowNull: true,
  }
});

module.exports = ProductCleaning;
