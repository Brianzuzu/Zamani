const express = require('express');
const router = express.Router();
const upload = require('../config/cloudinary');

router.post('/upload', upload.single('image'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        // req.file.path contains the Cloudinary URL
        res.json({
            message: 'Image uploaded successfully!',
            imageUrl: req.file.path,
        });
    } catch (error) {
        res.status(500).json({ message: 'Upload failed', error: error.message });
    }
});

module.exports = router;
