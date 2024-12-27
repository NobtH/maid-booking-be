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

