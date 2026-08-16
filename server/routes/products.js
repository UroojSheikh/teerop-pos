const express = require('express');
const router = express.Router();
const { getProducts, createProduct, updateProduct, deleteProduct } = require('../controllers/productController');
const { verifyToken, requireRole } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Public route for now (can be restricted if needed)
router.get('/', verifyToken, getProducts);

// Admin and Inventory Manager only
router.post('/', verifyToken, requireRole(['Admin', 'Inventory Manager']), upload.single('image'), createProduct);
router.put('/:id', verifyToken, requireRole(['Admin', 'Inventory Manager']), upload.single('image'), updateProduct);
router.delete('/:id', verifyToken, requireRole(['Admin', 'Inventory Manager']), deleteProduct);

module.exports = router;
