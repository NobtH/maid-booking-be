import express from 'express';
import { registerController, 
    loginController, 
    forgotPasswordController, 
    getAllUsers, 
    deleteUser, 
    updateProfile } from '~/controllers/authController.js';
import { validateRegister } from '~/middlewares/validate.js';
import { requireSignIn, isAdmin } from '~/middlewares/authValidation';

const authRouter = express.Router();

// Route đăng ký
authRouter.post('/register', validateRegister, registerController);
authRouter.post('/forgot-password', forgotPasswordController);
authRouter.post('/login', loginController);

authRouter.get('/protected-route', requireSignIn, (req, res) => {
    res.status(200).json({ message: 'You have access.', user: req.user });
  });

authRouter.get('/users', requireSignIn, isAdmin, getAllUsers)

authRouter.delete('/users/:userId', requireSignIn, isAdmin, deleteUser);
  
authRouter.get('/admin-route', requireSignIn, isAdmin, (req, res) => {
    res.status(200).json({ message: 'Admin access granted.', user: req.user });
  });

  authRouter.put('/profile', requireSignIn, updateProfile);

export default authRouter;


