/* eslint-disable no-console */
import Review from '~/models/reviewModel'
import Booking from '~/models/bookingModel'
import Maid from '~/models/maidModel'

export const addReview = async (req, res) => {
  try {
    const { bookingId, rating: rawRating, comment } = req.body;
    const userId = req.user.id;

    const rating = Number(rawRating);
    // Kiểm tra booking
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found.' });
    }

    if (booking.userId.toString() !== userId) {
      return res.status(403).json({ message: 'You are not authorized to review this booking.' });
    }

    if (booking.status !== 'completed') {
      return res.status(400).json({ message: 'You can only review completed bookings.' });
    }

    // Tìm Maid theo userId
    const maid = await Maid.findOne({ userId: booking.maidId });
    if (!maid) {
      return res.status(404).json({ message: 'Maid not found for this userId.' });
    }

    // Kiểm tra nếu đã review
    const existingReview = await Review.findOne({ bookingId });
    if (existingReview) {
      return res.status(400).json({ message: 'This booking has already been reviewed.' });
    }

    // Tạo review
    const review = await Review.create({
      bookingId,
      maidId: maid._id,
      userId,
      rating,
      comment,
    });

    // Cập nhật rating trong Maid
    maid.totalRatings += 1; // Tăng tổng số đánh giá
    maid.totalScore += rating; // Cộng tổng điểm đánh giá
    maid.ratings = (maid.totalScore / maid.totalRatings).toFixed(1); // Tính trung bình
    await maid.save();

    // Đánh dấu booking đã được review
    booking.isReviewed = true;
    await booking.save();

    res.status(201).json({
      message: 'Review added successfully and Maid rating updated.',
      review,
      maid,
    });
  } catch (error) {
    console.error('Error adding review:', error.message);
    res.status(500).json({ message: 'Internal server error.', error: error.message });
  }
};

export const getReviewByBookingId = async (req, res) => {
  try {
    const { bookingId } = req.query;

    if (!bookingId) {
      return res.status(400).json({ message: 'Booking ID is required.' });
    }

    const review = await Review.findOne({ bookingId }).populate('userId maidId');

    if (!review) {
      return res.status(404).json({ message: 'Review not found for this booking.' });
    }

    res.status(200).json({
      message: 'Review retrieved successfully.',
      review,
    });
  } catch (error) {
    console.error('Error fetching review:', error.message);
    res.status(500).json({ message: 'Internal server error.', error: error.message });
  }
};


export const getReviewsForMaid = async (req, res) => {
  try {
    const { maidId } = req.params

    const reviews = await Review.find({ maidId }).populate('userId', 'name')

    res.status(200).json({
      message: 'Reviews retrieved successfully.',
      reviews
    })
  } catch (error) {
    console.error('Error retrieving reviews:', error.message)
    res.status(500).json({ message: 'Internal server error.', error: error.message })
  }
}


export const getMyReviews = async (req, res) => {
  try {
    const maidId = req.user.id

    const reviews = await Review.find({ maidId }).populate('userId', 'name comment')

    res.status(200).json({
      message: 'Your reviews retrieved successfully.',
      reviews
    })
  } catch (error) {
    console.error('Error retrieving your reviews:', error.message)
    res.status(500).json({ message: 'Internal server error.', error: error.message })
  }
}

export const updateReview = async (req, res) => {
  try {
    const { reviewId } = req.params
    const { rating, comment } = req.body
    const userId = req.user.id

    const review = await Review.findById(reviewId)

    if (!review) {
      return res.status(404).json({ message: 'Review not found.' })
    }

    if (review.userId.toString() !== userId) {
      return res.status(403).json({ message: 'Access denied: You are not the owner of this review.' })
    }

    if (rating) {
      if (rating < 1 || rating > 5) {
        return res.status(400).json({ message: 'Rating must be between 1 and 5.' })
      }
      review.rating = rating
    }

    if (comment) {
      review.comment = comment
    }

    await review.save()

    res.status(200).json({
      message: 'Review updated successfully.',
      review
    })
  } catch (error) {
    console.error('Error updating review:', error.message)
    res.status(500).json({ message: 'Internal server error.', error: error.message })
  }
}

export const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params
    const userId = req.user.id

    const review = await Review.findById(reviewId)
    if (!review) {
      return res.status(404).json({ message: 'Review not found.' })
    }

    if (review.userId.toString() !== userId) {
      return res.status(403).json({ message: 'You are not authorized to delete this review.' })
    }

    await review.remove()

    res.status(200).json({ message: 'Review deleted successfully.' })
  } catch (error) {
    console.error('Error deleting review:', error.message)
    res.status(500).json({ message: 'Internal server error.', error: error.message })
  }
}

