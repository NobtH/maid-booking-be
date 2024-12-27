/* eslint-disable no-console */
import { env } from '~/config/environment'
import mongoose from 'mongoose'

export const CONNECT_DB = async () => {
  if (!env.MONGODB_URI || !env.DATABASE_NAME) {
    throw new Error('MONGODB_URI and DATABASE_NAME are required!')
  }

  try {
    await mongoose.connect(env.MONGODB_URI, {})

    console.log('MongoDB Connected successfully with Mongoose!')
  } catch (error) {
    console.error('Error connecting to MongoDB with Mongoose:', error.message)
    throw error
  }
}

export const CLOSE_DB = async () => {
  try {
    await mongoose.disconnect()
    console.log('MongoDB Disconnected successfully!')
  } catch (error) {
    console.error('Error disconnecting MongoDB:', error.message)
  }
}
