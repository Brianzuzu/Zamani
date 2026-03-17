const User = require('../models/User');

// @desc    Get current user profile
// @route   GET /api/users/me
exports.getMe = async (req, res) => {
    try {
        res.json(req.user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @desc    Get all users
// @route   GET /api/users
exports.getUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @desc    Create a user
// @route   POST /api/users
exports.createUser = async (req, res) => {
    const user = new User({
        firebaseId: req.body.firebaseId,
        email: req.body.email,
        name: req.body.name,
        role: req.body.role || 'user',
        homeCountry: req.body.homeCountry,
        currentCountry: req.body.currentCountry,
        preferredCurrency: req.body.preferredCurrency,
        currencySymbol: req.body.currencySymbol,
        phone: req.body.phone
    });

    try {
        const newUser = await user.save();
        res.status(201).json(newUser);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// @desc    Update a user
// @route   PUT /api/users/:id
exports.updateUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// @desc    Delete a user
// @route   DELETE /api/users/:id
exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json({ message: 'User deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
