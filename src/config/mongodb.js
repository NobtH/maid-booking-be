/* eslint-disable no-console */
import { env } from '~/config/environment'
import mongoose from 'mongoose';

let maidBookingInstance = null
let mongoClientInstance = null

export const CONNECT_DB = async () => {
  if (!env.MONGODB_URI || !env.DATABASE_NAME) {
    throw new Error('MONGODB_URI and DATABASE_NAME are required!')
  }

  try {
    // Kết nối Mongoose
    await mongoose.connect(env.MONGODB_URI, {
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
    });

    console.log('MongoDB Connected successfully with Mongoose!');
  } catch (error) {
    console.error('Error connecting to MongoDB with Mongoose:', error.message);
    throw error;
  }
}

export const GET_DB = () => {
  if (!maidBookingInstance) {
    throw new Error('Must connect to db first!')
  }
  return maidBookingInstance
}

export const CLOSE_DB = async () => {
  try {
    await mongoose.disconnect();
    console.log('MongoDB Disconnected successfully!');
  } catch (error) {
    console.error('Error disconnecting MongoDB:', error.message);
  }
};
