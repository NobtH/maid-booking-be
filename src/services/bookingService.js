/* eslint-disable no-console */
import { GET_DB } from '~/config/mongodb'
import { ObjectId } from 'mongodb'
import { bookingValidationSchema, bookingUpdateValidationSchema } from '~/validations/bookingValidation'

export const checkUserExists = async (userId) => {
  try {
    const db = GET_DB()
    const user = await db.collection('users').findOne({ _id: new ObjectId(userId) })
    return !!user
  } catch (error) {
    throw new Error('Error checking user existence in database')
  }
}

export const checkMaidExists = async (maidId) => {
  try {
    const db = GET_DB()
    const maid = await db.collection('maids').findOne({ _id: new ObjectId(maidId) })
    return !!maid
  } catch (error) {
    throw new Error('Error checking maid existence in database')
  }
}


export const createBookingService = async (bookingData) => {
  try {
    const { error } = bookingValidationSchema.validate(bookingData)
    if (error) {
      throw new Error(error.details[0].message)
    }

    const userExists = await checkUserExists(bookingData.userId)
    if (!userExists) {
      throw new Error('User does not exist.')
    }

    const db = GET_DB()

    console.log('Received booking data:', bookingData)

    const result = await db.collection('bookings').insertOne({
      userId: new ObjectId(bookingData.userId),
      maidId: null,
      date: new Date(bookingData.date),
      hours: bookingData.hours,
      price: bookingData.price,
      status: bookingData.status || 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    })

    return {
      acknowledged: result.acknowledged,
      insertedId: result.insertedId,
      ...bookingData,
      maidId: null
    }
  } catch (error) {
    throw new Error(`Error creating booking in database: ${error.message}`)
  }
}


export const getBookingsService = async () => {
  const db = GET_DB()
  const bookings = await db.collection('bookings').find().toArray()
  return bookings
}

export const getBookingByIdService = async (id) => {
  try {
    const db = GET_DB()
    const booking = await db.collection('bookings').findOne({ _id: new ObjectId(id) })
    return booking
  } catch (error) {
    throw new Error('Error fetching booking by id from database')
  }
}

export const updateBookingService = async (bookingId, updateData) => {
  try {
    const { error } = bookingUpdateValidationSchema.validate(updateData)
    if (error) {
      throw new Error(error.details[0].message)
    }

    const db = GET_DB()

    if (updateData.maidId) {
      updateData.maidId = new ObjectId(updateData.maidId)
      const maidExists = await checkMaidExists(updateData.maidId)
      if (!maidExists) {
        throw new Error('Maid does not exist.')
      }
    }

    const result = await db.collection('bookings').findOneAndUpdate(
      { _id: new ObjectId(bookingId) },
      { $set: { ...updateData, updatedAt: new Date() } },
      { returnDocument: 'after' }
    )

    return result.value
  } catch (error) {
    throw new Error(`Error updating booking in database: ${error.message}`)
  }
}

export const deleteBookingByIdService = async (bookingId) => {
  try {
    const db = GET_DB()

    const result = await db.collection('bookings').deleteOne({ _id: new ObjectId(bookingId) })

    return result
  } catch (error) {
    throw new Error('Error deleting booking in database')
  }
}

export const getReviewByBookingIdService = async (bookingId) => {
  try {
    const db = GET_DB()

    const review = await db.collection('reviews').findOne({
      bookingId: new ObjectId(bookingId)
    })

    if (!review) {
      throw new Error('Review not found for this booking')
    }

    return review
  } catch (error) {
    throw new Error(`Error fetching review by booking ID: ${error.message}`)
  }
}


