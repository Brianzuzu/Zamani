const { admin } = require('../config/firebase');
const User = require('../models/User');

const adminAuth = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const decodedToken = await admin.auth().verifyIdToken(token);
        const user = await User.findOne({ firebaseId: decodedToken.uid });

        if (!user || user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied: Admin only' });
        }

        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Unauthorized', error: error.message });
    }
};

module.exports = adminAuth;
