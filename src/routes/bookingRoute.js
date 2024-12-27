import express from 'express'
import { createBooking,
  acceptBooking,
  completeBooking,
  updateBookingByUser,
  getBooking,
  getAllBookings,
  getUserOrMaidBookings,
  cancelBooking } from '~/controllers/bookingController'
import { requireSignIn, isMaid, isAdmin } from '~/middlewares/authValidation'

const bookingRouter = express.Router()

bookingRouter.post('/bookings', requireSignIn, createBooking)

bookingRouter.put('/bookings/:bookingId/accept', requireSignIn, isMaid, acceptBooking)

bookingRouter.put('/bookings/:bookingId/complete', requireSignIn, isMaid, completeBooking)

bookingRouter.put('/bookings/:bookingId/cancel', requireSignIn, cancelBooking)

bookingRouter.put('/bookings/:bookingId', requireSignIn, updateBookingByUser)

bookingRouter.get('/bookings/mine', requireSignIn, getUserOrMaidBookings)

bookingRouter.get('/bookings/:bookingId', requireSignIn, getBooking)

bookingRouter.get('/bookings', requireSignIn, isAdmin, getAllBookings)

export default bookingRouter