/* eslint-disable no-console */
import Booking from '~/models/bookingModel'
import User from '~/models/userModel'
import { sendEmail } from '~/services/emailService'

export const createBooking = async (req, res) => {
  try {
    const { userId } = req.user
    const { date, from, to, price, location, phone, description } = req.body

    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({ message: 'User not found.' })
    }

    if (!date || !from || !to || !price || !location || !phone) {
      return res.status(400).json({ message: 'All required fields must be filled.' })
    }

    if (new Date(date) < new Date()) {
      return res.status(400).json({ message: 'Booking date cannot be in the past.' })
    }

    if (from >= to) {
      return res.status(400).json({ message: 'Invalid time range.' })
    }

    const newBooking = await Booking.create({
      userId,
      date,
      from,
      to,
      price,
      location,
      phone,
      description
    })

    res.status(201).json({
      message: 'Booking created successfully.',
      booking: newBooking
    })
  } catch (error) {
    console.error('Error creating booking:', error.message)
    res.status(500).json({ message: 'Internal server error.', error: error.message })
  }
}

export const acceptBooking = async (req, res) => {
  try {
    const { bookingId } = req.params
    const maidId = req.user.id

    const booking = await Booking.findById(bookingId).populate('userId')

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found.' })
    }

    if (booking.maidId) {
      return res.status(400).json({ message: 'Booking has already been accepted by another maid.' })
    }

    booking.maidId = maidId
    booking.status = 'confirmed'
    await booking.save()

    if (booking.userId?.email) {
      const userMessage = `
        Dear ${booking.userId.name},
        Your booking scheduled on ${booking.date} has been accepted by a maid.
        Booking details:
        - Location: ${booking.location}
        - Price: ${booking.price}
        - Time: ${booking.from} to ${booking.to}

        Thank you for using our service!
      `
      await sendEmail(booking.userId.email, 'Your Booking Has Been Accepted', userMessage)
    }

    res.status(200).json({
      message: 'Booking accepted successfully.',
      booking
    })

  } catch (error) {
    console.error('Error accepting booking:', error.message)
    res.status(500).json({ message: 'Internal server error.', error: error.message })
  }
}

export const completeBooking = async (req, res) => {
  try {
    const { bookingId } = req.params

    const booking = await Booking.findById(bookingId)

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found.' })
    }

    if (booking.status !== 'confirmed') {
      return res.status(400).json({ message: 'Only confirmed bookings can be completed.' })
    }

    booking.status = 'completed'
    await booking.save()

    res.status(200).json({
      message: 'Booking completed successfully.',
      booking
    })
  } catch (error) {
    console.error('Error completing booking:', error.message)
    res.status(500).json({ message: 'Internal server error.', error: error.message })
  }
}

export const updateBookingByUser = async (req, res) => {
  try {
    const { bookingId } = req.params
    const userId = req.user.id
    const { date, from, to, description, price, location } = req.body

    const booking = await Booking.findById(bookingId)

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found.' })
    }

    if (booking.userId.toString() !== userId) {
      return res.status(403).json({ message: 'Access denied: You are not the owner of this booking.' })
    }

    if (booking.status !== 'pending') {
      return res.status(400).json({ message: 'Only pending bookings can be updated.' })
    }

    if (date) booking.date = date
    if (from) booking.hours = from
    if (to) booking.to = to
    if (description) booking.description = description
    if (price) booking.price = price
    if (location) booking.location = location

    await booking.save()

    res.status(200).json({
      message: 'Booking updated successfully.',
      booking
    })
  } catch (error) {
    console.error('Error updating booking:', error.message)
    res.status(500).json({ message: 'Internal server error.', error: error.message })
  }
}

export const getBooking = async (req, res) => {
  try {
    const { bookingId } = req.params
    const { id: userId, role } = req.user

    const booking = await Booking.findById(bookingId).populate('userId maidId')
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found.' })
    }

    if (
      role !== 'admin' &&
      booking.userId._id.toString() !== userId &&
      booking.maidId?.toString() !== userId
    ) {
      return res.status(403).json({ message: 'Access denied: You are not authorized to view this booking.' })
    }

    res.status(200).json({
      message: 'Booking retrieved successfully.',
      booking
    })
  } catch (error) {
    console.error('Error retrieving booking:', error.message)
    res.status(500).json({ message: 'Internal server error.', error: error.message })
  }
}

export const getAllBookings = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied: Only admins can view all bookings.' })
    }

    const bookings = await Booking.find().populate('userId maidId')

    res.status(200).json({
      message: 'All bookings retrieved successfully.',
      bookings
    })
  } catch (error) {
    console.error('Error retrieving bookings:', error.message)
    res.status(500).json({ message: 'Internal server error.', error: error.message })
  }
}

export const getUserOrMaidBookings = async (req, res) => {
  try {
    const { id: userId, role } = req.user

    let bookings

    if (role === 'maid') {
      bookings = await Booking.find({ maidId: userId }).populate('userId maidId')
    }
    else if (role === 'user') {
      bookings = await Booking.find({ userId: userId }).populate('userId maidId')
    }
    else {
      return res.status(403).json({ message: 'Access denied: Admin cannot use this route.' })
    }

    res.status(200).json({
      message: 'Bookings retrieved successfully.',
      bookings
    })
  } catch (error) {
    console.error('Error retrieving bookings:', error.message)
    res.status(500).json({ message: 'Internal server error.', error: error.message })
  }
}

export const cancelBooking = async (req, res) => {
  try {
    const { bookingId } = req.params
    const { id: userId, role } = req.user

    const booking = await Booking.findById(bookingId)

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found.' })
    }

    if (role === 'user') {
      if (booking.userId.toString() !== userId) {
        return res.status(403).json({ message: 'Access denied: You are not the owner of this booking.' })
      }
      if (booking.status !== 'pending') {
        return res.status(400).json({ message: 'You can only cancel bookings with status "pending".' })
      }
    } else if (role === 'maid') {
      if (booking.maidId?.toString() !== userId) {
        return res.status(403).json({ message: 'Access denied: You are not assigned to this booking.' })
      }
      if (booking.status !== 'confirmed') {
        return res.status(400).json({ message: 'You can only cancel bookings with status "confirmed".' })
      }
    } else if (role !== 'admin') {
      return res.status(403).json({ message: 'Access denied: You cannot cancel this booking.' })
    }

    booking.status = 'cancelled'
    await booking.save()

    res.status(200).json({
      message: 'Booking cancelled successfully.',
      booking
    })
  } catch (error) {
    console.error('Error cancelling booking:', error.message)
    res.status(500).json({ message: 'Internal server error.', error: error.message })
  }
}


