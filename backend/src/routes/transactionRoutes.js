const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const auth = require('../middleware/auth');

// @desc    Get all transactions (Admin)
router.get('/', auth, transactionController.getAllTransactions);

// @desc    Update transaction status (Admin)
router.patch('/:id/status', auth, transactionController.updateTransactionStatus);

module.exports = router;
