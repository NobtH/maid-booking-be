import express from 'express'
import { createReview, getReviews, getReviewById, updateReview, deleteReview } from '~/controllers/reviewController'
import { reviewUpdateValidationSchema, reviewValidationSchema } from '~/validations/reviewValidation'
import { validateInput } from '~/validations/validateInput'

const reviewRouter = express.Router()

reviewRouter.post('/review', validateInput(reviewValidationSchema), createReview)
reviewRouter.get('/review', getReviews)
reviewRouter.get('/review/:id', getReviewById)
reviewRouter.put('/review/user/:userId/:reviewId', validateInput(reviewUpdateValidationSchema), updateReview)
reviewRouter.delete('/review/user/:userId/:reviewId', deleteReview)

export default reviewRouter