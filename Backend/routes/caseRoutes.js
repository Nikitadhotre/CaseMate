const express = require('express');
const router = express.Router();
const { protect, authorizeRoles } = require('../middlewares/authMiddleware');
const {
  addCase,
  getClientCases,
  getLawyerCases,
  getAllCases,
  updateCase,
  updateCaseDetails,
  updateHearingDate,
  getCaseById,
} = require('../controllers/caseController');

// All case routes require authentication
router.use(protect);

// @route   POST /api/cases/add
// @desc    Add a new case
// @access  Private/Lawyer
router.post('/add', authorizeRoles('lawyer'), addCase);

// @route   GET /api/cases/client/:clientId
// @desc    Get all cases for a client
// @access  Private/Client or Admin
router.get('/client/:clientId', authorizeRoles('client', 'admin'), getClientCases);

// @route   GET /api/cases/lawyer/:lawyerId
// @desc    Get all cases for a lawyer
// @access  Private/Lawyer or Admin
router.get('/lawyer/:lawyerId', authorizeRoles('lawyer', 'admin'), getLawyerCases);

// @route   GET /api/cases/all
// @desc    Get all cases (Admin only)
// @access  Private/Admin
router.get('/all', authorizeRoles('admin'), getAllCases);

// @route   GET /api/cases/:caseId
// @desc    Get case by ID
// @access  Private/Lawyer (own case only), Client (own case only), or Admin
router.get('/:caseId', authorizeRoles('lawyer', 'client', 'admin'), getCaseById);

// @route   PUT /api/cases/update/:caseId
// @desc    Update case details (full update)
// @access  Private/Lawyer (own case only) or Admin
router.put('/update/:caseId', authorizeRoles('lawyer', 'admin'), updateCaseDetails);

// @route   PUT /api/cases/update-hearing/:caseId
// @desc    Update next hearing date
// @access  Private/Lawyer (own case only) or Admin
router.put('/update-hearing/:caseId', authorizeRoles('lawyer', 'admin'), updateHearingDate);

module.exports = router;
