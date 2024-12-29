import express from 'express'
import { addReview,
  getReviewsForMaid,
  getMyReviews,
  deleteReview,
  updateReview } from '~/controllers/reviewController'
import { requireSignIn } from '~/middlewares/authValidation'

const reviewRouter = express.Router()

reviewRouter.post('/reviews', requireSignIn, addReview)

reviewRouter.get('/reviews/maid/:maidId', requireSignIn, getReviewsForMaid)

reviewRouter.get('/reviews/myReview', requireSignIn, getMyReviews)

reviewRouter.put('/reviews/:id', requireSignIn, updateReview)

reviewRouter.delete('/reviews/:id', requireSignIn, deleteReview)

export default reviewRouter
