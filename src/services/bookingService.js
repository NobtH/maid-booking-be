/* eslint-disable no-console */
import { GET_DB } from '~/config/mongodb'
import { ObjectId } from 'mongodb'
import { bookingValidationSchema, bookingUpdateValidationSchema } from '~/validations/bookingValidation'

export const checkUserExists = async (userId) => {
  try {
    const db = GET_DB()
    const user = await db.collection('users').findOne({ _id: new ObjectId(userId) })
    return !!user // Trả về true nếu User tồn tại, ngược lại là false
  } catch (error) {
    throw new Error('Error checking user existence in database')
  }
}

export const checkMaidExists = async (maidId) => {
  try {
    const db = GET_DB()
    const maid = await db.collection('maids').findOne({ _id: new ObjectId(maidId) })
    return !!maid // Trả về true nếu Maid tồn tại, ngược lại là false
  } catch (error) {
    throw new Error('Error checking maid existence in database')
  }
}


export const createBookingService = async (bookingData) => {
  try {
    // Validate input data
    const { error } = bookingValidationSchema.validate(bookingData)
    if (error) {
      throw new Error(error.details[0].message)
    }

    // Kiểm tra User tồn tại
    const userExists = await checkUserExists(bookingData.userId)
    if (!userExists) {
      throw new Error('User does not exist.')
    }

    const db = GET_DB()

    console.log('Received booking data:', bookingData)

    const result = await db.collection('bookings').insertOne({
      userId: new ObjectId(bookingData.userId),
      maidId: null, // Maid sẽ được gán sau
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
      maidId: null // Đảm bảo maidId luôn null tại thời điểm tạo
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
    // Validate input data
    const { error } = bookingUpdateValidationSchema.validate(updateData)
    if (error) {
      throw new Error(error.details[0].message)
    }

    const db = GET_DB()

    // Xử lý cập nhật maidId nếu được cung cấp, không bắt buộc
    if (updateData.maidId) {
      updateData.maidId = new ObjectId(updateData.maidId)
      const maidExists = await checkMaidExists(updateData.maidId)
      if (!maidExists) {
        throw new Error('Maid does not exist.')
      }
    }


    // Cập nhật thông tin booking trong MongoDB
    const result = await db.collection('bookings').findOneAndUpdate(
      { _id: new ObjectId(bookingId) }, // Điều kiện tìm kiếm
      { $set: { ...updateData, updatedAt: new Date() } }, // Cập nhật dữ liệu và updatedAt
      { returnDocument: 'after' } // Trả về document sau khi cập nhật
    )

    return result.value // Trả về booking sau khi cập nhật
  } catch (error) {
    throw new Error(`Error updating booking in database: ${error.message}`)
  }
}

export const deleteBookingByIdService = async (bookingId) => {
  try {
    const db = GET_DB()

    // Xóa booking trong MongoDB
    const result = await db.collection('bookings').deleteOne({ _id: new ObjectId(bookingId) })

    return result // Trả về kết quả xóa
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


