/* eslint-disable no-console */
import express from 'express'
import { CONNECT_DB, CLOSE_DB } from '~/config/mongodb'
import exitHook from 'async-exit-hook'
import { errorHandlingMiddleware } from '~/middlewares/errorHandlingMiddleware'
import authRouter from '~/routes/v1/authRoute'
import dotenv from 'dotenv';
import bookingRouter from './routes/v1/bookingRoute'
dotenv.config();

const START_SERVER = () => {
  const app = express()

  app.use(express.json())

  app.get('/', (req, res) => {
    res.end('<h1>Hello World!</h1><hr>')
  })

  app.use('/api', authRouter)
  app.use('/api', bookingRouter)


  app.use(errorHandlingMiddleware)

  app.use((err, req, res, next) => {
    console.error('Error:', err.message)
    res.status(500).json({ error: 'Internal Server Error' })
    next()
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