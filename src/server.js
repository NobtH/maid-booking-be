/* eslint-disable no-console */
import express from 'express'
import { CONNECT_DB, CLOSE_DB } from '~/config/mongodb'
import exitHook from 'async-exit-hook'
import { env } from '~/config/environment'
import userRouter from './routes/v1/userRoute'
import { errorHandlingMiddleware } from './middlewares/errorHandlingMiddleware'
import maidRouter from './routes/v1/maidRoute'
import bookingRouter from './routes/v1/bookingRoute'
import reviewRouter from './routes/v1/reviewRoute'

const START_SERVER = () => {
  const app = express()

  app.use(express.json())

  // Định nghĩa route cơ bản
  app.get('/', (req, res) => {
    res.end('<h1>Hello World!</h1><hr>')
  })

  app.use('/v1', userRouter)
  app.use('/v1', maidRouter)
  app.use('/v1', bookingRouter)
  app.use('/v1', reviewRouter)

  app.use(errorHandlingMiddleware)

  // Middleware xử lý lỗi (nếu có)
  app.use((err, req, res, next) => {
    console.error('Error:', err.message)
    res.status(500).json({ error: 'Internal Server Error' })
    next()
  })

  // Khởi động server
  app.listen(env.APP_PORT, env.APP_HOST, () => {
    console.log(
      `Hello ${env.AUTHOR}, I am running at http://${env.APP_HOST}:${env.APP_PORT}/`
    )
  })

  // Đảm bảo ngắt kết nối khi thoát ứng dụng
  exitHook(async () => {
    await CLOSE_DB() // Đảm bảo MongoDB được đóng hoàn toàn
    console.log('Server disconnected successfully.')
  })
}

// Kết nối MongoDB trước khi khởi động server
CONNECT_DB()
  .then(() => {
    console.log('Successfully connected to MongoDB')
    START_SERVER()
  })
  .catch((error) => {
    console.error('Failed to connect to MongoDB:', error.message)
    process.exit(1) // Thoát ứng dụng nếu không kết nối được
  })