import { GET_DB } from '~/config/mongodb'
import { ObjectId } from 'mongodb'

export const createReviewService = async (reviewData) => {
  try {
    const db = GET_DB()

    const booking = await db.collection('bookings').findOne({
      _id: new ObjectId(reviewData.bookingId)
    })

    if (booking.userId.toString() !== reviewData.userId) {
      throw new Error('User is not associated with this booking')
    }


    if (!booking) {
      throw new Error('Booking not found')
    }

    // if (booking.status !== 'completed') {
    //   throw new Error('Review can only be created for completed bookings');
    // }

    const result = await db.collection('reviews').insertOne({
      bookingId: new ObjectId(reviewData.bookingId),
      maidId: new ObjectId(reviewData.maidId),
      userId: new ObjectId(reviewData.userId),
      rating: reviewData.rating,
      comment: reviewData.comment || '',
      createdAt: new Date(),
      updatedAt: new Date()
    })

    return {
      acknowledged: result.acknowledged,
      insertedId: result.insertedId,
      ...reviewData
    }
  } catch (error) {
    throw new Error(`Error creating review: ${error.message}`)
  }
}

export const getReviewsService = async () => {
  const db = GET_DB()
  const reviews = await db.collection('reviews').find().toArray()
  return reviews
}

export const getReviewByIdService = async (id) => {
  try {
    const db = GET_DB()
    const review = await db.collection('reviews').findOne({ _id: new ObjectId(id) })
    return review
  } catch (error) {
    throw new Error(`Error getting review by id: ${error.message}`)
  }
}

export const updateReviewService = async (userId, reviewId, updateData) => {
  try {
    const db = GET_DB()

    const review = await db.collection('reviews').findOne({
      _id: new ObjectId(reviewId),
      userId: new ObjectId(userId)
    })

    if (!review) {
      throw new Error('Review not found or user not authorized')
    }

    const result = await db.collection('reviews').findOneAndUpdate(
      { _id: new ObjectId(reviewId) },
      { $set: { ...updateData, updatedAt: new Date() } },
      { returnDocument: 'after' }
    )

    return result.value
  } catch (error) {
    throw new Error(`Error updating review: ${error.message}`)
  }
}

export const deleteReviewService = async (userId, reviewId) => {
  try {
    const db = GET_DB()

    const review = await db.collection('reviews').findOne({
      _id: new ObjectId(reviewId),
      userId: new ObjectId(userId)
    })

    if (!review) {
      throw new Error('Review not found or user not authorized')
    }

    const result = await db.collection('reviews').deleteOne({
      _id: new ObjectId(reviewId)
    })

    return result.deletedCount
  } catch (error) {
    throw new Error(`Error deleting review: ${error.message}`)
  }
}

