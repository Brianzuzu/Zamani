const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const auth = require('../middleware/auth');

// Public routes
router.get('/', projectController.getProjects);
router.get('/:id', projectController.getProject);

// Admin routes (Protected)
// Assuming auth middleware sets req.user and we can check for admin role
router.post('/', auth, projectController.createProject);
router.put('/:id', auth, projectController.updateProject);
router.delete('/:id', auth, projectController.deleteProject);

module.exports = router;
