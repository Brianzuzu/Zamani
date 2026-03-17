const { admin } = require('../config/firebase');
const User = require('../models/User');

const auth = async (req, res, next) => {
    // DEV BYPASS
    if (process.env.NODE_ENV === 'development') {
        req.user = { 
            _id: '66a52093e0988e001c8e4d1a',
            id: '66a55093e0688e001c8e4d1a',
            email: 'dev@zamani.io',
            name: 'Developer'
        };
        return next();
    }

    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const decodedToken = await admin.auth().verifyIdToken(token);
        const user = await User.findOne({ firebaseId: decodedToken.uid });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Unauthorized', error: error.message });
    }
};

module.exports = auth;
