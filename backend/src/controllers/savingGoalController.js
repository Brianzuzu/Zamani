const SavingGoal = require('../models/SavingGoal');
const Transaction = require('../models/Transaction');

// @desc    Get all saving goals for current user
// @route   GET /api/savings
exports.getMyGoals = async (req, res) => {
    try {
        const goals = await SavingGoal.find({ user: req.user._id });
        res.json(goals);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @desc    Create a new saving goal
// @route   POST /api/savings
exports.createGoal = async (req, res) => {
    const goal = new SavingGoal({
        user: req.user._id,
        project: req.body.projectId,
        title: req.body.title,
        category: req.body.category,
        targetAmount: req.body.target,
        currency: req.body.currency || req.user.preferredCurrency,
        currencySymbol: req.body.currencySymbol || req.user.currencySymbol,
        timeline: req.body.timeline,
        type: req.body.type,
        color: req.body.color,
        icon: req.body.icon
    });

    try {
        const newGoal = await goal.save();
        res.status(201).json(newGoal);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// @desc    Add funds to a saving goal
// @route   POST /api/savings/:id/deposit
exports.deposit = async (req, res) => {
    try {
        const goal = await SavingGoal.findById(req.params.id);
        if (!goal) return res.status(404).json({ message: 'Goal not found' });

        const amount = Number(req.body.amount);
        goal.currentAmount += amount;
        
        if (goal.currentAmount >= goal.targetAmount) {
            goal.status = 'Completed';
        }

        await goal.save();

        // Create transaction record
        const transaction = new Transaction({
            user: req.user._id,
            amount: amount,
            currency: goal.currency,
            type: 'Deposit',
            method: req.body.method || 'M-Pesa',
            status: 'Completed',
            description: `Deposit to ${goal.title}`,
            reference: `SAV-${Date.now()}`
        });
        await transaction.save();

        res.json({ goal, transaction });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// @desc    Get all saving goals (Admin)
// @route   GET /api/savings/all
exports.getAllGoals = async (req, res) => {
    try {
        const goals = await SavingGoal.find().populate('user', 'name email');
        res.json(goals);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @desc    Request a withdrawal from a saving goal
// @route   POST /api/savings/:id/withdraw
exports.withdraw = async (req, res) => {
    try {
        const goal = await SavingGoal.findById(req.params.id);
        if (!goal) return res.status(404).json({ message: 'Goal not found' });

        // Security check
        if (goal.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        const amount = Number(req.body.amount);
        if (isNaN(amount) || amount <= 0) {
            return res.status(400).json({ message: 'Invalid amount' });
        }

        if (goal.currentAmount < amount) {
            return res.status(400).json({ message: 'Insufficient funds' });
        }

        // We subtract the amount and create a pending withdrawal transaction
        // It remains pending until the admin approves and executes it.
        goal.currentAmount -= amount;
        
        // Reset completion status if it was completed but now has less funds
        // Actually, completion usually means goals reached, not balance.
        // But let's leave status as is or update if needed.
        if (goal.currentAmount < goal.targetAmount && goal.status === 'Completed') {
            goal.status = 'Active';
        }

        await goal.save();

        // Create a PENDING withdrawal transaction for admin approval
        const transaction = new Transaction({
            user: req.user._id,
            amount: amount,
            currency: goal.currency,
            type: 'Withdrawal',
            method: req.body.method || 'M-Pesa',
            status: 'Pending',
            description: `Withdrawal request from ${goal.title}`,
            reference: `WDR-${Date.now()}`,
            metadata: {
                goalId: goal._id,
                phoneNumber: req.body.phoneNumber,
                bankDetails: req.body.bankDetails
            }
        });
        await transaction.save();

        res.json({ 
            message: 'Withdrawal request submitted for approval',
            goal, 
            transaction 
        });
    } catch (err) {
        console.error('Withdrawal Error:', err);
        res.status(400).json({ message: err.message });
    }
};
