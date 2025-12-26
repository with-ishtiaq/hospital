const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/authMiddleware');
const userController = require('../controllers/userController');

// Get all users (admin only)
router.get('/', authenticate, authorize(['admin']), userController.getAllUsers);

// Get user by ID (admin or self)
router.get('/:id', authenticate, userController.getUserById);

// Create user (admin only)
router.post('/', authenticate, authorize(['admin']), userController.createUser);

// Update user (admin or self)
router.put('/:id', authenticate, userController.updateUser);

// Delete user (admin only)
router.delete('/:id', authenticate, authorize(['admin']), userController.deleteUser);

module.exports = router;
