/* eslint-disable no-console */
import { createMaidService,
  getMaidsService,
  getMaidByIdService,
  getMaidByUserIdService,
  getAllReviewsForMaidService,
  updateMaidByIdService,
  updateUserForMaidService,
  deleteMaidByIdService,
  getBookingForMaidService } from '~/services/maidService'

export const createMaid = async (req, res) => {
  try {
    const { userId, experience, hourlyRate, location } = req.body


    if (!userId) {
      return res.status(400).json({ error: 'User ID is required.' })
    }

    const maid = await createMaidService({
      userId,
      experience,
      hourlyRate,
      location
    })

    res.status(201).json({ maid })
  } catch (error) {
    console.error('Error creating maid:', error.message)
    res.status(500).json({ error: error.message })
  }
}

export const getMaids = async (req, res) => {
  try {
    const maids = await getMaidsService()
    res.status(200).json(maids)
  } catch (error) {
    console.error('Error getting maids:', error.message)
    res.status(500).json({ error: error.message })
  }
}

export const getMaidById = async (req, res) => {
  try {
    const maid = await getMaidByIdService(req.params.id)
    if (!maid) {
      return res.status(404).json({ error: 'Maid not found' })}
    res.status(200).json(maid)
  } catch (error) {
    console.error('Error getting maid by id:', error.message)
    res.status(500).json({ error: error.message })
  }
}

export const getMaidByUserId = async(req, res) => {
  try {
    const maid = await getMaidByUserIdService(req.params.userId)
    if (!maid) {
      return res.status(404).json({ error: 'Maid not found' })}
    res.status(200).json(maid)
  } catch (error) {
    console.error('Error getting maid by userId:', error.message)
    res.status(500).json({ error: error.message })
  }
}

export const updateMaid = async (req, res) => {
  try {
    const maidId = req.params.id
    const { name, email, phone, address, ...maidData } = req.body // Phân tách thông tin User và Maid

    const updatedMaid = await updateMaidByIdService(maidId, maidData)

    if (!updatedMaid) {
      return res.status(404).json({ error: 'Maid not found' })
    }

    const updatedUser = await updateUserForMaidService(updatedMaid.userId, { name, email, phone, address })

    res.status(200).json({ maid: updatedMaid, user: updatedUser })
  } catch (error) {
    console.error('Error updating maid:', error.message)
    res.status(500).json({ error: error.message })
  }
}

export const deleteMaid = async (req, res) => {
  try {
    const maidId = req.params.id

    const result = await deleteMaidByIdService(maidId)

    if (!result.maidDeleted && !result.userDeleted) {
      return res.status(404).json({ error: 'Maid or User not found' })
    }

    res.status(200).json({ message: 'Maid and associated User deleted successfully', result })
  } catch (error) {
    console.error('Error deleting maid and user:', error.message)
    res.status(500).json({ error: error.message })
  }
}

export const getReviewsForMaid = async (req, res) => {
  try {
    const maidId = req.params.maidId
    const reviews = await getAllReviewsForMaidService(maidId)
    res.status(200).json(reviews)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

export const getBookingForMaid = async (req, res) => {
  try {
    const maidId = req.params.maidId
    const bookings = await getBookingForMaidService(maidId)
    res.status(200).json(bookings)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}