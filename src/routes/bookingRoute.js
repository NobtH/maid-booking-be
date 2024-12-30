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

bookingRouter.post('/bookings/create', requireSignIn, createBooking)

bookingRouter.get('/bookings/:bookingId', requireSignIn, getBooking)

bookingRouter.post('/bookings/:bookingId/accept', requireSignIn, isMaid,(req, res, next) => {
  console.log('PATCH /bookings/:bookingId/accept is called');
  next();
}, acceptBooking)

bookingRouter.put('/bookings/:bookingId/complete', requireSignIn, isMaid, completeBooking)

bookingRouter.put('/bookings/:bookingId/cancel', requireSignIn, cancelBooking)

bookingRouter.put('/bookings/:bookingId', requireSignIn, updateBookingByUser)

bookingRouter.get('/bookings/mine', requireSignIn, getUserOrMaidBookings)


bookingRouter.get('/bookings', getAllBookings)

export default bookingRouter