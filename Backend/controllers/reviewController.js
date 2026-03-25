const Review = require('../models/reviewModel');
const Lawyer = require('../models/lawyerModel');
const Client = require('../models/clientModel');
const Case = require('../models/caseModel');

// @desc    Create a new review for a lawyer
// @route   POST /api/reviews
// @access  Private/Client
const createReview = async (req, res) => {
  try {
    const { lawyerId, rating, reviewText } = req.body;
    const clientId = req.user._id;

    // Check if client has worked with this lawyer (has a case)
    const hasCase = await Case.findOne({
      clientId: clientId,
      lawyerId: lawyerId,
    });

    if (!hasCase) {
      return res.status(403).json({
        success: false,
        message: 'You can only review lawyers you have worked with',
      });
    }

    // Check if review already exists
    const existingReview = await Review.findOne({
      clientId: clientId,
      lawyerId: lawyerId,
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this lawyer',
      });
    }

    // Create the review
    const review = await Review.create({
      clientId,
      lawyerId,
      rating,
      reviewText,
    });

    // Populate the review for response
    const populatedReview = await Review.findById(review._id)
      .populate('clientId', 'name')
      .populate('lawyerId', 'name');

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully',
      review: populatedReview,
    });
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating review',
    });
  }
};

// @desc    Get all reviews for a lawyer
// @route   GET /api/reviews/lawyer/:lawyerId
// @access  Public
const getLawyerReviews = async (req, res) => {
  try {
    const { lawyerId } = req.params;

    const reviews = await Review.find({ lawyerId })
      .populate('clientId', 'name')
      .sort({ createdAt: -1 });

    // Calculate average rating
    const totalReviews = reviews.length;
    const averageRating = totalReviews > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews
      : 0;

    res.status(200).json({
      success: true,
      message: 'Reviews retrieved successfully',
      reviews,
      averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal
      totalReviews,
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching reviews',
    });
  }
};

// @desc    Get client's review for a specific lawyer
// @route   GET /api/reviews/client/:lawyerId
// @access  Private/Client
const getClientReview = async (req, res) => {
  try {
    const { lawyerId } = req.params;
    const clientId = req.user._id;

    const review = await Review.findOne({
      clientId: clientId,
      lawyerId: lawyerId,
    });

    res.status(200).json({
      success: true,
      review,
    });
  } catch (error) {
    console.error('Error fetching client review:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching review',
    });
  }
};

// @desc    Update a review
// @route   PUT /api/reviews/:reviewId
// @access  Private/Client (own review only)
const updateReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { rating, reviewText } = req.body;
    const clientId = req.user._id;

    // Find the review
    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found',
      });
    }

    // Check ownership
    if (review.clientId.toString() !== clientId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: You can only update your own reviews',
      });
    }

    // Update the review
    const updatedReview = await Review.findByIdAndUpdate(
      reviewId,
      { rating, reviewText },
      { new: true, runValidators: true }
    )
      .populate('clientId', 'name')
      .populate('lawyerId', 'name');

    res.status(200).json({
      success: true,
      message: 'Review updated successfully',
      review: updatedReview,
    });
  } catch (error) {
    console.error('Error updating review:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating review',
    });
  }
};

module.exports = {
  createReview,
  getLawyerReviews,
  getClientReview,
  updateReview,
};
