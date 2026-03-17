const express = require('express');
const router = express.Router();
const supportController = require('../controllers/supportController');
const auth = require('../middleware/auth');

router.get('/tickets', auth, supportController.getTickets);
router.put('/tickets/:id', auth, supportController.updateTicket);

module.exports = router;
