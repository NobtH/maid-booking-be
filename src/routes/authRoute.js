import express from 'express'
import { registerController,
  loginController,
  forgotPasswordController,
  deleteUser,
  updateProfile,
  getUser } from '~/controllers/authController.js'
import { validateRegister } from '~/middlewares/validate.js'
import { requireSignIn, isAdmin } from '~/middlewares/authValidation'

const authRouter = express.Router()

authRouter.post('/register', validateRegister, registerController)

authRouter.post('/forgot-password', forgotPasswordController)

authRouter.post('/login', loginController)

authRouter.get('/protected-route', requireSignIn, (req, res) => {
  res.status(200).json({ message: 'You have access.', user: req.user })
})

authRouter.get('/users/:userId', requireSignIn, isAdmin, getUser)

authRouter.delete('/users/:userId', requireSignIn, isAdmin, deleteUser)

authRouter.get('/admin-route', requireSignIn, isAdmin, (req, res) => {
  res.status(200).json({ message: 'Admin access granted.', user: req.user })
})

authRouter.put('/profile', requireSignIn, updateProfile)

export default authRouter


