const express = require('express');
const router = express.Router();
const { checkout, getTransactions } = require('../controllers/posController');
const { verifyToken, requireRole } = require('../middleware/auth');

// Cashier can checkout
router.post('/checkout', verifyToken, requireRole(['Cashier', 'Admin']), checkout);

// Admin can view all transactions
router.get('/transactions', verifyToken, requireRole(['Admin']), getTransactions);

module.exports = router;
