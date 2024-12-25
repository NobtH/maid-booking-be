/* eslint-disable no-unused-vars */
import { GET_DB } from '~/config/mongodb'
import { ObjectId } from 'mongodb'
import { maidUpdateValidationSchema } from '~/validations/maidValidation'

export const createMaidService = async (maidData) => {
  try {

    console.log('Received maid data:', maidData);

    if (!maidData.userId) {
      throw new Error('User ID is required.');
    }
    const db = GET_DB()

    // Kiểm tra User tồn tại trước khi tạo Maid
    const user = await db.collection('users').findOne({ _id: new ObjectId(maidData.userId) })
    if (!user) {
      throw new Error('User does not exist.')
    }

    // Chèn thông tin Maid cơ bản từ User
    const result = await db.collection('maids').insertOne({
      userId: new ObjectId(maidData.userId),
      experience: maidData.experience || 0, // Nếu không có, dùng giá trị mặc định
      hourlyRate: maidData.hourlyRate || 0, // Nếu không có, dùng giá trị mặc định
      location: maidData.location || '', // Nếu không có, dùng giá trị mặc định
      ratings: [],
      totalRatings: 0,
      totalScore: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    return {
      acknowledged: result.acknowledged,
      insertedId: result.insertedId,
      ...maidData
    }
  } catch (error) {
    throw new Error(`Error creating maid in database: ${error.message}`)
  }
}

export const getMaidsService = async () => {
  const db = GET_DB()
  const maids = await db.collection('maids').find().toArray()
  return maids
}

export const getMaidByIdService = async (id) => {
  try {
    const db = GET_DB()
    const maid = await db.collection('maids').findOne({ _id: new ObjectId(id) })
    return maid
  } catch (error) {
    throw new Error('Error fetching maid by id from database')
  }
}

export const getMaidByUserIdService = async (userId) => {
  try {
    const db = GET_DB()

    // Tìm kiếm maid theo userId
    const maid = await db.collection('maids').findOne({ userId: new ObjectId(userId) })

    return maid // Trả về thông tin maid
  } catch (error) {
    throw new Error('Error fetching maid by userId from database')
  }
}

export const updateMaidByIdService = async (id, data) => {
  try {
    // Validate input data
    const { error } = maidUpdateValidationSchema.validate(data)
    if (error) {
      throw new Error(error.details[0].message)
    }

    const db = GET_DB()

    const result = await db.collection('maids').findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: data },
      { returnDocument: 'after', upsert: false }
    )

    return result
  } catch (error) {
    throw new Error(`Error updating maid in database: ${error.message}`)
  }
}

export const updateUserForMaidService = async (userId, updateData) => {
  try {
    const db = GET_DB()

    // Xóa các trường không cần thiết nếu không được truyền vào
    const filteredData = Object.fromEntries(
      Object.entries(updateData).filter(([_, value]) => value !== undefined)
    )

    // Cập nhật thông tin user trong MongoDB
    const result = await db.collection('users').findOneAndUpdate(
      { _id: new ObjectId(userId) }, // Điều kiện tìm kiếm
      { $set: filteredData }, // Dữ liệu cần cập nhật
      { returnDocument: 'after', upsert: false } // Trả về tài liệu sau khi cập nhật
    )

    return result // Trả về user sau khi cập nhật
  } catch (error) {
    throw new Error('Error updating user for maid in database')
  }
}

export const deleteMaidByIdService = async (id) => {
  try {
    const db = GET_DB()
    const maid = await db.collection('maids').findOne({ _id: new ObjectId(id) })

    if (!maid) {
      throw new Error('Maid not found')
    }

    const maidDeletionResult = await db.collection('maids').deleteOne({ _id: new ObjectId(id) })

    const userDeletionResult = await db.collection('users').deleteOne({ _id: new ObjectId(maid.userId) })

    return {
      maidDeleted: maidDeletionResult.deletedCount > 0,
      userDeleted: userDeletionResult.deletedCount > 0
    }

  } catch (error) {
    throw new Error('Error deleting maid in database')
  }
}

export const getAllReviewsForMaidService = async (maidId) => {
  try {
    const db = GET_DB()

    const reviews = await db.collection('reviews').find({
      maidId: new ObjectId(maidId)
    }).toArray()

    return reviews
  } catch (error) {
    throw new Error(`Error fetching reviews for maid: ${error.message}`)
  }
}

export const getBookingForMaidService = async (maidId) => {
  try {
    const db = GET_DB()
    const bookings = await db.collection('bookings').find({ maidId: new ObjectId(maidId) }).toArray()
    return bookings
  } catch (error) {
    throw new Error('Error fetching bookings for maid from database')
  }
}
