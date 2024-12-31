/* eslint-disable no-console */
import Booking from '~/models/bookingModel'
import Maid from '~/models/maidModel'
import User from '~/models/userModel'
import { sendEmail } from '~/services/emailService'

export const createBooking = async (req, res) => {
  try {
    const userId = req.user.id
    const { date, from, to, price, location, phone, description, title } = req.body

    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({ message: 'User not found in db' })
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
      description,
      title
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
    console.log('Accept Booking Controller Called');
    console.log('Request Params:', req.params);
    console.log('Request User:', req.user);
    const { bookingId } = req.params
    const maidId = req.user.id

    const booking = await Booking.findById(bookingId).populate('userId')

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found.' })
    }

    if (booking.maidId) {
      return res.status(400).json({ message: 'Booking has already been accepted by another maid.' })
    }
    const maid = await Maid.findOne({ userId: maidId });
    if (!maid) {
      return res.status(404).json({ message: 'Maid not found for this user.' });
    }
    if (maid.isFree === false) {
      return res.status(400).json({ message: 'Bạn không thể nhận 2 việc 1 lúc' })
    }
    maid.isFree = false
    await maid.save()

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
    const { bookingId } = req.params;

    // Tìm Booking bằng bookingId
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found.' });
    }

    if (booking.status !== 'confirmed') {
      return res.status(400).json({ message: 'Only confirmed bookings can be completed.' });
    }

    const maid = await Maid.findOne({ userId: booking.maidId });

    if (!maid) {
      return res.status(404).json({ message: 'Maid not found for this booking.' });
    }

    booking.status = 'completed';
    await booking.save();

    maid.isFree = true;
    await maid.save();

    res.status(200).json({
      message: 'Booking completed successfully.',
      booking,
      maid,
    });
  } catch (error) {
    console.error('Error completing booking:', error.message);
    res.status(500).json({ message: 'Internal server error.', error: error.message });
  }
};

export const cancelBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { id: userId, role } = req.user;

    // Chỉ cho phép người dùng hủy booking
    if (role !== 'user') {
      return res.status(403).json({ message: 'Access denied: Only users can cancel bookings.' });
    }

    const booking = await Booking.findById(bookingId).populate('userId maidId');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found.' });
    }

    // Kiểm tra quyền sở hữu booking
    if (booking.userId._id.toString() !== userId) {
      return res.status(403).json({ message: 'Access denied: You are not the owner of this booking.' });
    }

    // Chỉ cho phép hủy khi trạng thái là "pending" hoặc "confirmed"
    if (!['pending', 'confirmed'].includes(booking.status)) {
      return res.status(400).json({
        message: 'You can only cancel bookings with status "pending" or "confirmed".',
      });
    }

    // Nếu trạng thái là "confirmed", cập nhật trạng thái isFree của Maid
    if (booking.status === 'confirmed' && booking.maidId) {
      const maid = await Maid.findOne({ userId: booking.maidId._id });
      if (maid) {
        maid.isFree = true; // Cập nhật trạng thái isFree
        await maid.save();
      }
    }

    // Cập nhật trạng thái booking thành "cancelled"
    booking.status = 'cancelled';
    await booking.save();

    // Gửi email thông báo
    if (booking.maidId && booking.maidId.email) {
      const maidMessage = `
        Dear ${booking.maidId.name},
        The booking scheduled on ${booking.date} has been cancelled by the user.
        Booking details:
        - Location: ${booking.location}
        - Price: ${booking.price}
        - Time: ${booking.from} to ${booking.to}
        
        Thank you for understanding!
      `;
      await sendEmail(booking.maidId.email, 'Booking Cancellation Notification', maidMessage);
    }

    if (booking.userId && booking.userId.email) {
      const userMessage = `
        Dear ${booking.userId.name},
        Your booking scheduled on ${booking.date} has been successfully cancelled.
        Booking details:
        - Location: ${booking.location}
        - Price: ${booking.price}
        - Time: ${booking.from} to ${booking.to}

        Thank you for using our service!
      `;
      await sendEmail(booking.userId.email, 'Booking Cancellation Confirmation', userMessage);
    }

    res.status(200).json({
      message: 'Booking cancelled successfully and notifications sent.',
      booking,
    });
  } catch (error) {
    console.error('Error cancelling booking:', error.message);
    res.status(500).json({ message: 'Internal server error.', error: error.message});
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

    const booking = await Booking.findById(bookingId)
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found.' })
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

// export const getUserBookings = async (req, res) => {
//   try {
//     const { id: userId, role } = req.user; // Lấy userId và role từ middleware xác thực

//     // Tìm danh sách booking theo vai trò của người dùng
//     let bookings = [];
//     if (role === 'user') {
//       // Nếu là user, tìm các booking mà họ đã tạo
//       bookings = await Booking.find({ userId });
//     } else if (role === 'maid') {
//       // Nếu là maid, tìm các booking mà họ tham gia
//       bookings = await Booking.find({ maidId: userId });
//     }

//     // Kiểm tra nếu không có booking nào
//     if (!bookings || bookings.length === 0) {
//       return res.status(404).json({ message: 'Không có booking nào được tìm thấy.' });
//     }

//     // Trả về danh sách booking
//     res.status(200).json({
//       message: 'Lấy danh sách booking thành công.',
//       bookings,
//     });
//   } catch (error) {
//     console.error('Lỗi khi lấy danh sách booking:', error.message);
//     res.status(500).json({
//       message: 'Lỗi hệ thống.',
//       error: error.message,
//     });
//   }
// };


export const getAllBookings = async (req, res) => {
  try {

    const bookings = await Booking.find({ status: 'pending' }).populate('userId maidId');

    res.status(200).json({
      message: 'Pending bookings retrieved successfully.',
      bookings
    });
  } catch (error) {
    console.error('Error retrieving bookings:', error.message);
    res.status(500).json({ message: 'Internal server error.', error: error.message });
  }
};

export const getUserBookings = async (req, res) => {
  try {
    const { id: userId } = req.user; // Lấy id từ thông tin user đã xác thực

    // Tìm các booking liên quan đến userId hoặc maidId
    const bookings = await Booking.find({
      $or: [{ userId: userId }, { maidId: userId }],
    }).populate('userId maidId'); // Populate để lấy thông tin chi tiết user và maid

    if (!bookings || bookings.length === 0) {
      return res.status(404).json({ message: 'Không có booking nào được tìm thấy.' });
    }

    res.status(200).json({
      message: 'Lấy danh sách booking thành công.',
      bookings,
    });
  } catch (error) {
    console.error('Error retrieving bookings:', error.message);
    res.status(500).json({ message: 'Lỗi hệ thống.', error: error.message });
  }
}







