import express from 'express'
import { createBooking,
  getBookings,
  getBookingById,
  updateBooking,
  deleteBooking,
  getReviewByBookingId } from '~/controllers/bookingController'
import { bookingUpdateValidationSchema, bookingValidationSchema } from '~/validations/bookingValidation'
import { validateInput } from '~/validations/validateInput'

const bookingRouter = express.Router()

bookingRouter.post('/booking', validateInput(bookingValidationSchema), createBooking)
bookingRouter.get('/booking', getBookings)
bookingRouter.get('/booking/:id', getBookingById)
bookingRouter.put('/booking/:id', validateInput(bookingUpdateValidationSchema), updateBooking)
bookingRouter.delete('/booking/:id', deleteBooking)
bookingRouter.get('/booking/:id/review', getReviewByBookingId)

export default bookingRouter