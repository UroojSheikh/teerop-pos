const { Product, Transaction, TransactionItem, sequelize } = require('../models');

const checkout = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const { items } = req.body; // items: [{ productId, quantity }]
    
    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Cart is empty' });
    }

    let totalAmount = 0;
    const transactionItemsData = [];

    // 1. Verify stock and calculate total
    for (const item of items) {
      const product = await Product.findByPk(item.productId, { transaction: t, lock: true });
      if (!product) {
        throw new Error(`Product with ID ${item.productId} not found`);
      }
      
      if (product.quantityInStock < item.quantity) {
        throw new Error(`Insufficient stock for ${product.name}. Available: ${product.quantityInStock}`);
      }

      const unitPrice = parseFloat(product.price);
      const subtotal = unitPrice * item.quantity;
      totalAmount += subtotal;

      transactionItemsData.push({
        productId: product.id,
        quantity: item.quantity,
        unitPrice: unitPrice,
        subtotal: subtotal
      });

      // Decrement stock
      await product.update({
        quantityInStock: product.quantityInStock - item.quantity
      }, { transaction: t });
    }

    // 2. Calculate tax and grand total (e.g., 5% tax)
    const taxRate = 0.05;
    const taxAmount = totalAmount * taxRate;
    const grandTotal = totalAmount + taxAmount;

    // 3. Create Transaction
    const transaction = await Transaction.create({
      cashierId: req.userId, // From auth middleware
      totalAmount,
      taxAmount,
      grandTotal
    }, { transaction: t });

    // 4. Create TransactionItems
    const itemsToCreate = transactionItemsData.map(item => ({
      ...item,
      transactionId: transaction.id
    }));
    await TransactionItem.bulkCreate(itemsToCreate, { transaction: t });

    await t.commit();
    res.status(201).json({ success: true, message: 'Checkout completed successfully', transactionId: transaction.id });
  } catch (err) {
    await t.rollback();
    // Use 400 for business logic errors like insufficient stock
    if (err.message.includes('Insufficient stock') || err.message.includes('not found')) {
      return res.status(400).json({ success: false, message: err.message });
    }
    next(err);
  }
};

const getTransactions = async (req, res, next) => {
  try {
    const transactions = await Transaction.findAll({
      include: [{ model: TransactionItem, include: [Product] }],
      order: [['timestamp', 'DESC']]
    });
    res.json({ success: true, transactions });
  } catch (err) {
    next(err);
  }
};

module.exports = { checkout, getTransactions };
