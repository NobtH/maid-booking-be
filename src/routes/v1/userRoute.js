/* eslint-disable no-console */
import express from 'express'
import {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  getReviewsForUser,
  getBookingsForUser
} from '~/controllers/userController'
import { userUpdateValidationSchema, userValidationSchema } from '~/validations/userValidation'
import { validateInput } from '~/validations/validateInput'

const userRouter = express.Router()

userRouter.post('/user', validateInput(userValidationSchema), createUser)
userRouter.get('/user', getUsers)
userRouter.get('/user/:id', getUserById)
userRouter.get('/user/:id/reviews', getReviewsForUser)
userRouter.put('/user/:id', validateInput(userUpdateValidationSchema),updateUser)
userRouter.delete('/user/:id', deleteUser)
userRouter.get('/user/:id/bookings', getBookingsForUser)

export default userRouter
