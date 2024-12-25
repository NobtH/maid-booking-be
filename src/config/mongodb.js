/* eslint-disable no-console */
import { env } from '~/config/environment'
import { MongoClient, ServerApiVersion } from 'mongodb'

let maidBookingInstance = null
let mongoClientInstance = null

export const CONNECT_DB = async () => {
  if (!env.MONGODB_URI || !env.DATABASE_NAME) {
    throw new Error('MONGODB_URI and DATABASE_NAME are required!')
  }

  try {
    if (mongoClientInstance) {
      console.log('Connected MongoDB!')
      return
    }

    mongoClientInstance = new MongoClient(env.MONGODB_URI, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true
      }
    })

    await mongoClientInstance.connect()
    console.log('MongoDB Connected successfully!')

    maidBookingInstance = mongoClientInstance.db(env.DATABASE_NAME)
  } catch (error) {
    console.error('Error connect MongoDB:', error.message)
    throw error
  }
}

export const GET_DB = () => {
  if (!maidBookingInstance) {
    throw new Error('Must connect to db first!')
  }
  return maidBookingInstance
}

export const CLOSE_DB = async () => {
  if (mongoClientInstance) {
    console.log('MongoDB Disconnected')
    await mongoClientInstance.close()
    mongoClientInstance = null
    maidBookingInstance = null

  }
}
