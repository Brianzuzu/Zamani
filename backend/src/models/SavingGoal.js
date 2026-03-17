const mongoose = require('mongoose');

const savingGoalSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project'
    },
    title: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    targetAmount: {
        type: Number,
        required: true
    },
    currentAmount: {
        type: Number,
        default: 0
    },
    currency: {
        type: String,
        default: 'KES'
    },
    currencySymbol: {
        type: String,
        default: 'KSh'
    },
    timeline: {
        type: Number // Months
    },
    status: {
        type: String,
        enum: ['Active', 'Completed', 'Cancelled'],
        default: 'Active'
    },
    color: {
        type: String,
        default: '#0A1F44'
    },
    icon: {
        type: String,
        default: 'wallet'
    },
    type: {
        type: String,
        enum: ['Personal', 'Project', 'Business'],
        default: 'Personal'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('SavingGoal', savingGoalSchema);
