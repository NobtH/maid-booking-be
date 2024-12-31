import express from 'express'
import { createBooking,
  acceptBooking,
  completeBooking,
  updateBookingByUser,
  getBooking,
  getAllBookings,
  getUserOrMaidBookings,
  cancelBooking, 
  getUserBookings} from '~/controllers/bookingController'
import { requireSignIn } from '~/middlewares/authValidation'

const bookingRouter = express.Router()

bookingRouter.post('/bookings/create', requireSignIn, createBooking)

bookingRouter.get('/bookings/mine', requireSignIn, getUserBookings)

bookingRouter.get('/bookings/:bookingId', requireSignIn, getBooking)

bookingRouter.post('/bookings/:bookingId/accept', requireSignIn, acceptBooking)

bookingRouter.patch('/bookings/:bookingId/complete', requireSignIn, completeBooking)

bookingRouter.patch('/bookings/:bookingId/cancel', requireSignIn, cancelBooking)

bookingRouter.put('/bookings/:bookingId', requireSignIn, updateBookingByUser)

bookingRouter.get('/bookings', getAllBookings)

bookingRouter.get('/bookings', requireSignIn, getUserBookings)




export default bookingRouter