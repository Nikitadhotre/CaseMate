const express = require('express');
const router = express.Router();
const { protect, authorizeRoles } = require('../middlewares/authMiddleware');
const {
  createReview,
  getLawyerReviews,
  getClientReview,
  updateReview,
} = require('../controllers/reviewController');

// All review routes require authentication
router.use(protect);

// @route   POST /api/reviews
// @desc    Create a new review
// @access  Private/Client
router.post('/', authorizeRoles('client'), createReview);

// @route   GET /api/reviews/lawyer/:lawyerId
// @desc    Get all reviews for a lawyer
// @access  Public (after authentication)
router.get('/lawyer/:lawyerId', getLawyerReviews);

// @route   GET /api/reviews/client/:lawyerId
// @desc    Get client's review for a specific lawyer
// @access  Private/Client
router.get('/client/:lawyerId', authorizeRoles('client'), getClientReview);

// @route   PUT /api/reviews/:reviewId
// @desc    Update a review
// @access  Private/Client (own review only)
router.put('/:reviewId', authorizeRoles('client'), updateReview);

module.exports = router;
