import express from 'express'
import { registerController,
  loginController,
  forgotPasswordController,
  deleteUser,
  updateProfile,
  getUser,
  getProfile, 
  getAllUsers} from '~/controllers/authController.js'
import { validateRegister } from '~/middlewares/validate.js'
import { requireSignIn, isAdmin } from '~/middlewares/authValidation'
import User from '~/models/userModel'

const authRouter = express.Router()

authRouter.post('/register', validateRegister, registerController)

authRouter.post('/forgot-password', forgotPasswordController)

authRouter.post('/login', loginController)

authRouter.get('/protected-route', requireSignIn, async (req, res) => {
  const userId = req.user.id; // Lấy `userId` từ token
  const user = await User.findById(userId);
  res.json(user);
})

authRouter.get('/users', requireSignIn, getAllUsers)

authRouter.get('/profile', requireSignIn, getProfile)

authRouter.get('/users/:userId', requireSignIn, isAdmin, getUser)

authRouter.delete('/users/:userId', requireSignIn, isAdmin, deleteUser)

authRouter.get('/admin-route', requireSignIn, isAdmin, (req, res) => {
  res.status(200).json({ message: 'Admin access granted.', user: req.user })
})

authRouter.put('/profile', requireSignIn, updateProfile)

export default authRouter


