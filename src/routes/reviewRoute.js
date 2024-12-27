import express from 'express'
import { addReview, getReviewsForMaid, getMyReviews } from '~/controllers/reviewController'
import { requireSignIn } from '~/middlewares/authValidation'

const reviewRouter = express.Router()

reviewRouter.post('/reviews', requireSignIn, addReview)

reviewRouter.get('/reviews/maid/:maidId', requireSignIn, getReviewsForMaid)

reviewRouter.get('/reviews/my', requireSignIn, getMyReviews)

export default reviewRouter
