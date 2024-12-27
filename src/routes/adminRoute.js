import express from 'express'
import { getAdminStatistics,
  getAllUsers,
  deleteUser } from '~/controllers/adminController'
import { requireSignIn, isAdmin } from '~/middlewares/authValidation'

const adminRouter = express.Router()

// Route để lấy thống kê cho admin
adminRouter.get('/admin/statistics', requireSignIn, isAdmin, getAdminStatistics)

adminRouter.get('/admin/users', requireSignIn, isAdmin, getAllUsers)

adminRouter.delete('/admin/users/:userId/delete', requireSignIn, isAdmin, deleteUser)


export default adminRouter
