const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ProductTech = sequelize.define('ProductTech', {
  productId: {
    type: DataTypes.UUID,
    primaryKey: true,
    references: {
      model: 'Products',
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  warrantyPeriod: {
    type: DataTypes.INTEGER, // warranty period in months
    allowNull: true,
  },
  serialNumber: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: true,
  }
});

module.exports = ProductTech;
