const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        default: 'KES'
    },
    type: {
        type: String,
        enum: ['Deposit', 'Withdrawal', 'Investment', 'Refund'],
        required: true
    },
    method: {
        type: String,
        enum: ['M-Pesa', 'Bank Transfer', 'Card', 'Crypto'],
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Completed', 'Failed', 'Reversed'],
        default: 'Pending'
    },
    reference: {
        type: String,
        unique: true
    },
    provider: {
        type: String, // 'Flutterwave', 'M-Pesa', etc.
        default: 'Flutterwave'
    },
    providerReference: String, // Flutterwave's flw_ref or txId
    description: String,
    metadata: mongoose.Schema.Types.Mixed
}, {
    timestamps: true
});

module.exports = mongoose.model('Transaction', transactionSchema);
