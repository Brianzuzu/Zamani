const express = require('express');
const router = express.Router();
const savingGoalController = require('../controllers/savingGoalController');
const auth = require('../middleware/auth');

router.get('/', auth, savingGoalController.getMyGoals);
router.get('/all', auth, savingGoalController.getAllGoals); // TODO: Add admin middleware
router.post('/', auth, savingGoalController.createGoal);
router.post('/:id/deposit', auth, savingGoalController.deposit);
router.post('/:id/withdraw', auth, savingGoalController.withdraw);

module.exports = router;
