import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import StarRating from './StarRating';
import { Send, AlertCircle, CheckCircle } from 'lucide-react';

export default function ReviewForm({ lawyerId, lawyerName, onReviewSubmitted }) {
  const { user } = useAuth();
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [existingReview, setExistingReview] = useState(null);

  useEffect(() => {
    fetchExistingReview();
  }, [lawyerId]);

  const fetchExistingReview = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/reviews/client/${lawyerId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.review) {
        setExistingReview(response.data.review);
        setRating(response.data.review.rating);
        setReviewText(response.data.review.reviewText);
      }
    } catch (error) {
      // No existing review, that's fine
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      setError('Please select a rating');
      return;
    }

    if (!reviewText.trim()) {
      setError('Please write a review');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      const reviewData = {
        lawyerId,
        rating,
        reviewText: reviewText.trim(),
      };

      if (existingReview) {
        // Update existing review
        await axios.put(`${import.meta.env.VITE_API_URL}/api/reviews/${existingReview._id}`, reviewData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        // Create new review
        await axios.post('${import.meta.env.VITE_API_URL}/api/reviews', reviewData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }

      setSuccess(true);
      if (onReviewSubmitted) {
        onReviewSubmitted();
      }

      // Reset form if new review
      if (!existingReview) {
        setRating(0);
        setReviewText('');
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to submit review');
      console.error('Error submitting review:', error);
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-green-50 border border-green-200 rounded-lg p-4 text-center"
      >
        <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
        <p className="text-green-800 font-medium">
          {existingReview ? 'Review updated successfully!' : 'Review submitted successfully!'}
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-lg p-6"
    >
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        {existingReview ? 'Update Your Review' : 'Write a Review'} for {lawyerName}
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Rating *
          </label>
          <StarRating
            rating={rating}
            onRatingChange={setRating}
            interactive={true}
            size="w-6 h-6"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Review *
          </label>
          <textarea
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            rows="4"
            maxLength="500"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-800 focus:border-transparent"
            placeholder="Share your experience working with this lawyer..."
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            {reviewText.length}/500 characters
          </p>
        </div>

        {error && (
          <div className="flex items-center space-x-2 text-red-600 text-sm">
            <AlertCircle className="w-4 h-4" />
            <span>{error}</span>
          </div>
        )}

        <motion.button
          type="submit"
          disabled={submitting || rating === 0}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-slate-800 text-white py-2 px-4 rounded-md font-medium flex items-center justify-center space-x-2 hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send className="w-4 h-4" />
          <span>
            {submitting
              ? 'Submitting...'
              : existingReview
                ? 'Update Review'
                : 'Submit Review'
            }
          </span>
        </motion.button>
      </form>
    </motion.div>
  );
}
