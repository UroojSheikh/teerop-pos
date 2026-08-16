const { Product, Transaction, TransactionItem, sequelize } = require('../models');
const { Op } = require('sequelize');

const getStats = async (req, res, next) => {
  try {
    const totalTransactions = await Transaction.count();
    const totalSales = await Transaction.sum('grandTotal') || 0;
    
    const lowStockProducts = await Product.findAll({
      where: {
        quantityInStock: {
          [Op.lte]: sequelize.col('reorderThreshold')
        }
      }
    });

    // Recent transactions
    const recentTransactions = await Transaction.findAll({
      order: [['timestamp', 'DESC']],
      limit: 10,
      include: [{ model: TransactionItem, include: [Product] }]
    });

    res.json({ 
      success: true, 
      stats: { 
        totalTransactions, 
        totalSales, 
        lowStockCount: lowStockProducts.length,
        lowStockProducts,
        recentTransactions
      } 
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getStats };
