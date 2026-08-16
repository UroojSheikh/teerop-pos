const express = require('express');
const router = express.Router();
const { getStats } = require('../controllers/statsController');
const { verifyToken, requireRole } = require('../middleware/auth');

router.get('/', verifyToken, requireRole(['Admin']), getStats);

module.exports = router;
