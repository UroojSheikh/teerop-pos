const sequelize = require('../config/database');
const User = require('./User');
const Product = require('./Product');
const ProductFragile = require('./ProductFragile');
const ProductCold = require('./ProductCold');
const ProductTech = require('./ProductTech');
const ProductCleaning = require('./ProductCleaning');
const Transaction = require('./Transaction');
const TransactionItem = require('./TransactionItem');

// Product Associations (1-to-1)
Product.hasOne(ProductFragile, { foreignKey: 'productId', onDelete: 'CASCADE' });
ProductFragile.belongsTo(Product, { foreignKey: 'productId' });

Product.hasOne(ProductCold, { foreignKey: 'productId', onDelete: 'CASCADE' });
ProductCold.belongsTo(Product, { foreignKey: 'productId' });

Product.hasOne(ProductTech, { foreignKey: 'productId', onDelete: 'CASCADE' });
ProductTech.belongsTo(Product, { foreignKey: 'productId' });

Product.hasOne(ProductCleaning, { foreignKey: 'productId', onDelete: 'CASCADE' });
ProductCleaning.belongsTo(Product, { foreignKey: 'productId' });

// Transaction Associations
User.hasMany(Transaction, { foreignKey: 'cashierId' });
Transaction.belongsTo(User, { foreignKey: 'cashierId' });

Transaction.hasMany(TransactionItem, { foreignKey: 'transactionId', onDelete: 'CASCADE' });
TransactionItem.belongsTo(Transaction, { foreignKey: 'transactionId' });

Product.hasMany(TransactionItem, { foreignKey: 'productId' });
TransactionItem.belongsTo(Product, { foreignKey: 'productId' });

module.exports = {
  sequelize,
  User,
  Product,
  ProductFragile,
  ProductCold,
  ProductTech,
  ProductCleaning,
  Transaction,
  TransactionItem
};
