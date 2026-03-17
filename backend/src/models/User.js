const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firebaseId: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    status: {
        type: String,
        enum: ['Authorized', 'Restricted', 'Pending'],
        default: 'Authorized'
    },
    location: {
        type: String,
        default: 'Nairobi, Kenya'
    },
    homeCountry: {
        type: String,
        default: 'Kenya'
    },
    currentCountry: {
        type: String,
        default: 'Kenya'
    },
    preferredCurrency: {
        type: String,
        default: 'KES'
    },
    currencySymbol: {
        type: String,
        default: 'KSh'
    },
    phone: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('User', userSchema);
