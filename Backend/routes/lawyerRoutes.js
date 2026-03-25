const express = require('express');
const router = express.Router();
const { protect, authorizeRoles } = require('../middlewares/authMiddleware');
const { getProfile, getCases, updateProfile } = require('../controllers/lawyerController');

// @route   GET /api/lawyer/profile
// @desc    Get lawyer profile
// @access  Private/Lawyer
router.get('/profile', protect, authorizeRoles('lawyer'), getProfile);

// @route   PUT /api/lawyer/profile
// @desc    Update lawyer profile
// @access  Private/Lawyer
router.put('/profile', protect, authorizeRoles('lawyer'), updateProfile);

// @route   GET /api/lawyer/cases
// @desc    Get lawyer cases
// @access  Private/Lawyer
router.get('/cases', protect, authorizeRoles('lawyer'), getCases);

module.exports = router;
