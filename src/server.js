/* eslint-disable no-console */
import express from 'express'
import { CONNECT_DB, CLOSE_DB } from '~/config/mongodb'
import exitHook from 'async-exit-hook'
import { errorHandlingMiddleware } from '~/middlewares/errorHandlingMiddleware'
import authRouter from '~/routes/authRoute'
import dotenv from 'dotenv'
import bookingRouter from '~/routes/bookingRoute'
import reviewRouter from '~/routes/reviewRoute'
import adminRouter from '~/routes/adminRoute'
import maidRouter from '~/routes/maidRoute'
import cron from 'node-cron'
import cors from 'cors'
import { sendReminderEmails } from '~/services/emailService'
import userRouter from './routes/userRoute'

dotenv.config()

const START_SERVER = () => {
  const app = express()

  app.use(express.json())
  app.use(cors({
    origin: 'http://localhost:3000', // Chỉ cho phép từ frontend
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'], // Các phương thức được phép
    allowedHeaders: ['Content-Type', 'Authorization'], // Các header được phép
    credentials: true // Nếu cần gửi cookie
  }));
  
  app.options('*', cors());

  app.use('/api', authRouter)
  app.use('/api', userRouter)
  app.use('/api', maidRouter);
  app.use('/api', bookingRouter)
  app.use('/api', reviewRouter)
  app.use('/api', adminRouter)


  app.use(errorHandlingMiddleware)

  app.use((err, req, res, next) => {
    console.error('Error:', err.message)
    res.status(500).json({ error: 'Internal Server Error' })
    next()
  })

  cron.schedule('0 8 * * *', async () => {
    console.log('Running reminder email job...')
    await sendReminderEmails()
  })

  app.listen(process.env.APP_PORT, process.env.APP_HOST, () => {
    console.log(
      `Hello ${process.env.AUTHOR}, I am running at http://${process.env.APP_HOST}:${process.env.APP_PORT}/`
    )
  })

  exitHook(async () => {
    await CLOSE_DB()
    console.log('Server disconnected successfully.')
  })
}

CONNECT_DB()
  .then(() => {
    console.log('Successfully connected to MongoDB')
    START_SERVER()
  })
  .catch((error) => {
    console.error('Failed to connect to MongoDB:', error.message)
    process.exit(1)
  })