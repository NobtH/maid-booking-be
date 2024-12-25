/* eslint-disable no-console */
import { createUserService,
  getUsersService,
  getUserByIdService,
  updateUserByIdService,
  deleteUserByIdService,
  getAllReviewsForUserService,
  getBookingForUserService } from '~/services/userService'

export const createUser = async (req, res) => {
  try {
    const user = await createUserService(req.body)
    res.status(201).json(user)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const getUsers = async (_req, res) => {
  try {
    const users = await getUsersService()
    res.status(200).json(users)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const getUserById = async (req, res) => {
  try {
    const user = await getUserByIdService(req.params.id)
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }
    res.status(200).json(user)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const updateUser = async (req, res) => {
  try {
    const user = await updateUserByIdService(req.params.id, req.body)
    res.status(200).json(user)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}


export const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id

    const result = await deleteUserByIdService(userId)

    if (!result.userDeleted) {
      return res.status(404).json({ error: 'User not found' })
    }

    res.status(200).json({
      message: 'User and associated maid deleted successfully (if applicable)',
      result
    })
  } catch (error) {
    console.error('Error deleting user and maid:', error.message)
    res.status(500).json({ error: error.message })
  }
}

export const getReviewsForUser = async (req, res) => {
  try {
    const userId = req.params.userId
    const reviews = await getAllReviewsForUserService(userId)
    res.status(200).json(reviews)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

export const getBookingsForUser = async (req, res) => {
  try {
    const userId = req.params.userId
    const bookings = await getBookingForUserService(userId)
    res.status(200).json(bookings)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}
