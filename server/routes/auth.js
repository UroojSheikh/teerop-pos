const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');
const { verifyToken, requireRole } = require('../middleware/auth');

// Note: Admin restriction for registration should be enforced in production, 
// but allowing open registration for initial setup testing
router.post('/register', register); 
router.post('/login', login);

module.exports = router;
