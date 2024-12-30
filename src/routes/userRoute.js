import express from 'express'
import { getNameById } from '~/controllers/userContreller';

const userRouter = express.Router()

userRouter.get('/users/:id/name', getNameById);

export default userRouter