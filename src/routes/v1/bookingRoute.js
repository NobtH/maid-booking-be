import express from 'express'
import { createBooking, acceptBooking, completeBooking } from '~/controllers/bookingController';
import { requireSignIn, isMaid } from '~/middlewares/authValidation';
const bookingRouter = express.Router()

bookingRouter.post('/bookings', requireSignIn, createBooking); 
bookingRouter.put('/bookings/:bookingId/accept', requireSignIn, isMaid, acceptBooking);
bookingRouter.put('/bookings/:bookingId/complete', requireSignIn, isMaid, completeBooking);


export default bookingRouter;