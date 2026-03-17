const Transaction = require('../models/Transaction');
const SavingGoal = require('../models/SavingGoal');
const paymentController = require('./paymentController');

// @desc    Get all transactions (Admin)
// @route   GET /api/transactions
exports.getAllTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find()
            .populate('user', 'name email')
            .sort({ createdAt: -1 });
        res.json(transactions);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @desc    Update transaction status (Admin Approve/Reject)
// @route   PATCH /api/transactions/:id/status
exports.updateTransactionStatus = async (req, res) => {
    try {
        const transaction = await Transaction.findById(req.params.id);
        if (!transaction) return res.status(404).json({ message: 'Transaction not found' });

        const { status } = req.body;
        if (!['Completed', 'Rejected', 'Processing'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        const oldStatus = transaction.status;
        transaction.status = status;

        // --- AUTOMATED PAYOUT LOGIC ---
        // If status moved to Completed and it's a withdrawal, trigger payout
        if (status === 'Completed' && transaction.type === 'Withdrawal' && oldStatus !== 'Completed') {
            try {
                // Determine Bank code based on method
                // Note: For M-Pesa, Flutterwave bank code is 'MPS'
                const isMpesa = transaction.method === 'M-Pesa';
                
                const payoutDetails = {
                    amount: transaction.amount,
                    currency: transaction.currency || 'KES',
                    account_bank: isMpesa ? 'MPS' : (transaction.metadata?.bankCode || 'MPS'),
                    account_number: transaction.metadata?.phoneNumber || transaction.metadata?.bankDetails,
                    narration: `Zamani Withdrawal - ${transaction.reference}`,
                    reference: transaction.reference // Use our existing reference
                };

                // Trigger actual Flutterwave Payout
                const payoutResponse = await paymentController.initiatePayout(payoutDetails);
                
                if (payoutResponse.status === 'success') {
                    transaction.status = 'Completed';
                    transaction.providerReference = payoutResponse.data?.id?.toString();
                } else {
                    // If FLW fails, we might want to keep it as 'Processing' or alert admin
                    throw new Error('Flutterwave payout failed at provider level');
                }

            } catch (payoutErr) {
                console.error('Automated Payout Trace:', payoutErr.message);
                // We keep the local status update but log the error
                // In production, we should probably mark it as "Failed" or "Error"
                return res.status(500).json({ 
                    message: 'Status updated locally, but Flutterwave payout failed. Check balance or credentials.',
                    error: payoutErr.message 
                });
            }
        }

        // If rejection back to savings wallet
        if (status === 'Rejected' && transaction.type === 'Withdrawal' && oldStatus !== 'Rejected') {
            // Find the goal from metadata (we stored it)
            if (transaction.metadata && transaction.metadata.goalId) {
                const goal = await SavingGoal.findById(transaction.metadata.goalId);
                if (goal) {
                    goal.currentAmount += transaction.amount;
                    await goal.save();
                }
            }
        }

        await transaction.save();
        res.json(transaction);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};
