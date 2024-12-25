import { createReviewService, getReviewsService, getReviewByIdService, updateReviewService, deleteReviewService } from '~/services/reviewService'

export const createReview = async (req, res) => {
  try {
    const reviewData = req.body
    const result = await createReviewService(reviewData)
    res.status(201).json(result)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

export const getReviews = async (req, res) => {
  try {
    const reviews = await getReviewsService()
    res.status(200).json(reviews)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const getReviewById = async (req, res) => {
  try {
    const review = await getReviewByIdService(req.params.id)
    res.status(200).json(review)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const updateReview = async (req, res) => {
  try {
    const { userId, reviewId } = req.params
    const updateData = req.body
    const result = await updateReviewService(userId, reviewId, updateData)
    res.status(200).json(result)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

export const deleteReview = async (req, res) => {
  try {
    const { userId, reviewId } = req.params
    const result = await deleteReviewService(userId, reviewId)
    res.status(200).json(result)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}