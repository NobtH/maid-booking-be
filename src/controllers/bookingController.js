import Booking from '~/models/bookingModel';

import User from '~/models/userModel';

export const createBooking = async (req, res) => {
  try {
    const { maidId, date, hours, price, location } = req.body;
    const userId = req.user.id; // Lấy userId từ token

    // Tìm thông tin người dùng từ DB
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    if (!date || !hours || !price || !location) {
      return res.status(400).json({ message: 'Date, hours, price, and location are required.' });
    }

    const newBooking = await Booking.create({
      userId,
      maidId: maidId || null, // Nếu chưa có Maid nhận booking
      date,
      hours,
      price,
      location,
      phone: user.phone,
      status: 'pending',
    });

    res.status(201).json({
      message: 'Booking created successfully.',
      booking: newBooking,
    });
  } catch (error) {
    console.error('Error creating booking:', error.message);
    res.status(500).json({ message: 'Internal server error.', error: error.message });
  }
};

export const acceptBooking = async (req, res) => {
  try {
    const { bookingId } = req.params; // Lấy bookingId từ URL
    const maidId = req.user.id; // Lấy maidId từ token

    // Tìm booking cần được nhận
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found.' });
    }

    // Kiểm tra xem booking đã được nhận hay chưa
    if (booking.maidId) {
      return res.status(400).json({ message: 'Booking has already been accepted by another maid.' });
    }

    // Cập nhật maidId và trạng thái booking
    booking.maidId = maidId;
    booking.status = 'confirmed';
    await booking.save();

    res.status(200).json({
      message: 'Booking accepted successfully.',
      booking,
    });
  } catch (error) {
    console.error('Error accepting booking:', error.message);
    res.status(500).json({ message: 'Internal server error.', error: error.message });
  }
};

export const completeBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;

    // Tìm booking cần được cập nhật
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found.' });
    }

    // Kiểm tra trạng thái hiện tại của booking
    if (booking.status !== 'confirmed') {
      return res.status(400).json({ message: 'Only confirmed bookings can be completed.' });
    }

    // Cập nhật trạng thái booking thành "completed"
    booking.status = 'completed';
    await booking.save();

    res.status(200).json({
      message: 'Booking completed successfully.',
      booking,
    });
  } catch (error) {
    console.error('Error completing booking:', error.message);
    res.status(500).json({ message: 'Internal server error.', error: error.message });
  }
};


