/* eslint-disable no-console */
import Review from '~/models/reviewModel'
import Booking from '~/models/bookingModel'

export const addReview = async (req, res) => {
  try {
    const { bookingId, rating, comment } = req.body
    const userId = req.user.id

    const booking = await Booking.findById(bookingId)
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found.' })
    }

    if (booking.userId.toString() !== userId) {
      return res.status(403).json({ message: 'You are not authorized to review this booking.' })
    }

    if (booking.status !== 'completed') {
      return res.status(400).json({ message: 'You can only review completed bookings.' })
    }

    const existingReview = await Review.findOne({ bookingId })
    if (existingReview) {
      return res.status(400).json({ message: 'This booking has already been reviewed.' })
    }

    const review = await Review.create({
      bookingId,
      maidId: booking.maidId,
      userId,
      rating,
      comment
    })

    res.status(201).json({
      message: 'Review added successfully.',
      review
    })
  } catch (error) {
    console.error('Error adding review:', error.message)
    res.status(500).json({ message: 'Internal server error.', error: error.message })
  }
}

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

