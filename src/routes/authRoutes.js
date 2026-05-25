const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/register', authController.register);
router.post('/login', authController.login);

// User Management Routes (Admin only)
router.get('/users', protect, authorize('Admin'), authController.getAllUsers);
router.put('/users/:id/role', protect, authorize('Admin'), authController.updateUserRole);
router.delete('/users/:id', protect, authorize('Admin'), authController.deleteUser);

module.exports = router;
