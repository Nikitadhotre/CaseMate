const express = require('express');
const router = express.Router();
const { protect, authorizeRoles } = require('../middlewares/authMiddleware');
const { getDashboard, getProfile, getSystemOverview, getAllClients, getAllLawyers, updateProfile } = require('../controllers/adminController');

// @route   GET /api/admin/dashboard
router.get('/dashboard', protect, authorizeRoles('admin'), getDashboard);

// @route   GET /api/admin/profile
router.get('/profile', protect, authorizeRoles('admin'), getProfile);

// @route   PUT /api/admin/profile
router.put('/profile', protect, authorizeRoles('admin'), updateProfile);

// @route   GET /api/admin/overview
router.get('/overview', protect, authorizeRoles('admin'), getSystemOverview);

// @route   GET /api/admin/clients
router.get('/clients', protect, authorizeRoles('admin'), getAllClients);

// @route   GET /api/admin/lawyers
router.get('/lawyers', protect, authorizeRoles('admin'), getAllLawyers);

module.exports = router;
