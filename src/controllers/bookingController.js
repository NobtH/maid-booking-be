/* eslint-disable no-console */
import { createBookingService,
  checkUserExists,
  getBookingsService,
  getBookingByIdService,
  checkMaidExists,
  updateBookingService,
  deleteBookingByIdService,
  getReviewByBookingIdService
} from '~/services/bookingService'

export const createBooking = async (req, res) => {
  try {
    const { userId, date, hours, price } = req.body

    if (!userId || !date || !hours || !price) {
      return res.status(400).json({ error: 'userId, date, and hours are required' })
    }


    const userExists = await checkUserExists(userId)
    if (!userExists) {
      return res.status(404).json({ error: 'User does not exist' })
    }
    const newBooking = await createBookingService({ userId, date, hours, price })

    res.status(201).json(newBooking)
  } catch (error) {
    console.error('Error creating booking:', error.message)
    res.status(500).json({ error: error.message })
  }
}

export const getBookings = async (req, res) => {
  try {
    const bookings = await getBookingsService()
    res.status(200).json(bookings)
  } catch (error) {
    console.error('Error getting bookings:', error.message)
    res.status(500).json({ error: error.message })
  }
}

export const getBookingById = async (req, res) => {
  try {
    const booking = await getBookingByIdService(req.params.id)
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' })
    }
    res.status(200).json(booking)
  } catch (error) {
    console.error('Error getting booking by id:', error.message)
    res.status(500).json({ error: error.message })
  }
}

export const updateBooking = async (req, res) => {
  try {
    const bookingId = req.params.id
    const { maidId, ...updateData } = req.body

    if (maidId) {
      const maidExists = await checkMaidExists(maidId)
      if (!maidExists) {
        return res.status(404).json({ error: 'Maid does not exist' })
      }
      updateData.maidId = maidId
    }

    const updatedBooking = await updateBookingService(bookingId, updateData)

    if (!updatedBooking) {
      return res.status(404).json({ error: 'Booking not found' })
    }

    res.status(200).json(updatedBooking)
  } catch (error) {
    console.error('Error updating booking:', error.message)
    res.status(500).json({ error: error.message })
  }
}

export const deleteBooking = async (req, res) => {
  try {
    const bookingId = req.params.id

    const deletedBooking = await deleteBookingByIdService(bookingId)

    if (!deletedBooking) {
      return res.status(404).json({ error: 'Booking not found' })
    }

    res.status(200).json({ message: 'Booking deleted' })
  } catch (error) {
    console.error('Error deleting booking:', error.message)
    res.status(500).json({ error: error.message })
  }
}

export const getReviewByBookingId = async (req, res) => {
  try {
    const bookingId = req.params.id
    const review = await getReviewByBookingIdService(bookingId)
    if (!review) {
      return res.status(404).json({ error: 'Review not found for this booking' })
    }
    res.status(200).json(review)
  } catch (error) {
    console.error('Error getting review by booking id:', error.message)
    res.status(500).json({ error: error.message })
  }
}


