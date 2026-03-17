const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');

// @desc    Get current user profile
// @route   GET /api/users/me
router.get('/me', auth, userController.getMe);

// @desc    Get all users
// @route   GET /api/users
router.get('/', userController.getUsers);

// @desc    Create a user
// @route   POST /api/users
router.post('/', userController.createUser);

// @desc    Update a user
// @route   PUT /api/users/:id
router.put('/:id', auth, userController.updateUser);

// @desc    Delete a user
// @route   DELETE /api/users/:id
router.delete('/:id', auth, userController.deleteUser);

module.exports = router;

