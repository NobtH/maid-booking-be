import express from 'express'
import { createMaid,
  getMaids,
  getMaidById,
  getMaidByUserId,
  updateMaid,
  deleteMaid,
  getReviewsForMaid,
  getBookingForMaid
} from '~/controllers/maidController'
import { maidCreateValidationSchema, maidUpdateValidationSchema } from '~/validations/maidValidation'
import { validateInput } from '~/validations/validateInput'

const maidRouter = express.Router()

maidRouter.post('/maid', validateInput(maidCreateValidationSchema), createMaid)
maidRouter.get('/maid', getMaids)
maidRouter.get('/maid/:id', getMaidById)
maidRouter.get('/maid/user/:userId', getMaidByUserId)
maidRouter.put('/maid/:id', validateInput(maidUpdateValidationSchema), updateMaid)
maidRouter.delete('/maid/:id', deleteMaid)
maidRouter.get('maid/:id/reviews', getReviewsForMaid)
maidRouter.get('maid/:id/bookings', getBookingForMaid)

export default maidRouter
