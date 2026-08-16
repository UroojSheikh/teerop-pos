const express = require('express');
const router = express.Router();
const { getUsers, updateUserRole } = require('../controllers/userController');
const { verifyToken, requireRole } = require('../middleware/auth');

router.get('/', verifyToken, requireRole(['Admin']), getUsers);
router.put('/:id/role', verifyToken, requireRole(['Admin']), updateUserRole);

module.exports = router;
