import { GET_DB } from '~/config/mongodb'
import { ObjectId } from 'mongodb'
import bcrypt from 'bcrypt'
import { userUpdateValidationSchema } from '~/validations/userValidation'

export const createUserService = async (data) => {
  const db = GET_DB()
  const result = await db.collection('users').insertOne({
    ...data,
    createdAt: new Date(),
    updatedAt: new Date()
  })
  return {
    acknowledged: result.acknowledged,
    insertedId: result.insertedId,
    ...data
  }
}

export const getUsersService = async () => {
  const db = GET_DB()
  const users = await db.collection('users').find().toArray()
  return users
}

export const getUserByIdService = async (id) => {
  const db = GET_DB()
  const user = await db.collection('users').findOne({ _id: new ObjectId(id) })
  return user
}

export const updateUserByIdService = async (id, data) => {
  try {
    const { error } = userUpdateValidationSchema.validate(data)
    if (error) {
      throw new Error(error.details[0].message)
    }

    const db = GET_DB()

    if (data.password) {
      const salt = await bcrypt.genSalt(10)
      data.password = await bcrypt.hash(data.password, salt)
    }

    const result = await db.collection('users').findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: data },
      { returnDocument: 'after', upsert: false }
    )

    return result
  } catch (error) {
    throw new Error(`Error updating user in database: ${error.message}`)
  }
}

export const deleteUserByIdService = async (id) => {
  try {
    const db = GET_DB()

    const user = await db.collection('users').findOne({ _id: new ObjectId(id) })

    if (!user) {
      throw new Error('User not found')
    }

    let maidDeletionResult = null

    if (user.role === 'maid') {
      maidDeletionResult = await db.collection('maids').deleteOne({ userId: new ObjectId(id) })
    }

    const userDeletionResult = await db.collection('users').deleteOne({ _id: new ObjectId(id) })

    return {
      userDeleted: userDeletionResult.deletedCount > 0,
      maidDeleted: maidDeletionResult ? maidDeletionResult.deletedCount > 0 : null
    }
  } catch (error) {
    throw new Error(`Error deleting user and associated maid in database: ${error.message}`)
  }
}

export const getAllReviewsForUserService = async (userId) => {
  try {
    const db = GET_DB()

    const reviews = await db.collection('reviews').find({
      userId: new ObjectId(userId)
    }).toArray()

    return reviews
  } catch (error) {
    throw new Error(`Error fetching reviews for user: ${error.message}`)
  }
}

export const getBookingForUserService = async (userId) => {
  try {
    const db = GET_DB()

    const bookings = await db.collection('bookings').find({
      userId: new ObjectId(userId)
    }).toArray()

    return bookings
  } catch (error) {
    throw new Error(`Error fetching bookings for user: ${error.message}`)
  }
}
