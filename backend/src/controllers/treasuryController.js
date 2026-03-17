const Transaction = require('../models/Transaction');

// @desc    Get all transactions
// @route   GET /api/treasury/transactions
exports.getTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find().populate('user', 'name email').sort({ createdAt: -1 });
        res.json(transactions);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const SavingGoal = require('../models/SavingGoal');

// @desc    Get platform stats
// @route   GET /api/treasury/stats
exports.getStats = async (req, res) => {
    try {
        const transactions = await Transaction.find({ status: 'Completed' });
        
        // Total liquidity (all investments)
        const liquidity = transactions
            .filter(t => t.type === 'Investment')
            .reduce((sum, t) => sum + t.amount, 0);

        // Total savings
        const savingsGoals = await SavingGoal.find();
        const totalSavings = savingsGoals.reduce((sum, g) => sum + g.currentAmount, 0);

        res.json({
            liquidity,
            savings: totalSavings,
            pendingPayouts: 0, // Logic for payouts can be added later
            activeTickets: 0   // Logic for support tickets can be added later
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
