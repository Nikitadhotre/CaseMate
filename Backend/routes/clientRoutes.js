const express = require('express');
const router = express.Router();
const { protect, authorizeRoles } = require('../middlewares/authMiddleware');
const { getProfile, getSidebarStats, updateProfile, getLawyers, getLawyerById } = require('../controllers/clientController');

// @route   GET /api/client/profile
router.get('/profile', protect, authorizeRoles('client'), getProfile);

// @route   GET /api/client/stats
router.get('/stats', protect, authorizeRoles('client'), getSidebarStats);

// @route   PUT /api/client/profile
router.put('/profile', protect, authorizeRoles('client'), updateProfile);

// @route   GET /api/client/lawyers
// @desc    Get all lawyers
// @access  Public
router.get('/lawyers', getLawyers);

// @route   GET /api/client/lawyers/:id
// @desc    Get lawyer by ID
// @access  Public
router.get('/lawyers/:id', getLawyerById);

module.exports = router;