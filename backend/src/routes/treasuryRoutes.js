const express = require('express');
const router = express.Router();
const treasuryController = require('../controllers/treasuryController');
const auth = require('../middleware/auth');

router.get('/transactions', auth, treasuryController.getTransactions);
router.get('/stats', auth, treasuryController.getStats);

module.exports = router;
