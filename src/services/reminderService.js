import Booking from '~/models/bookingModel'
import { sendEmail } from '~/services/emailService'

export const sendReminderEmails = async () => {
  try {
    const now = new Date()
    const oneDayLater = new Date()
    oneDayLater.setDate(now.getDate() + 1)

    const upcomingBookings = await Booking.find({
      date: { $gte: now, $lte: oneDayLater },
      status: { $in: ['pending', 'confirmed'] }
    }).populate('userId maidId')

    for (const booking of upcomingBookings) {
      const user = booking.userId
      const maid = booking.maidId

      if (user && user.email) {
        const userMessage = `
          Dear ${user.name},
          This is a reminder for your upcoming booking on ${booking.date}.
          Location: ${booking.location}.
          Thank you for using our service!
        `
        await sendEmail(user.email, 'Upcoming Booking Reminder', userMessage)
      }

      if (maid && maid.email) {
        const maidMessage = `
          Dear ${maid.name},
          This is a reminder for the booking you accepted on ${booking.date}.
          Location: ${booking.location}.
          Please be prepared. Thank you for your work!
        `
        await sendEmail(maid.email, 'Upcoming Booking Reminder', maidMessage)
      }
    }

    console.log('Reminder emails sent successfully.')
  } catch (error) {
    console.error('Error sending reminder emails:', error.message)
  }
}
