import User from '~/models/userModel'
import Maid from '~/models/maidModel'
import Booking from '~/models/bookingModel'
import Review from '~/models/reviewModel'

export const getAdminStatistics = async (req, res) => {
  try {
    const usersCount = await User.countDocuments()

    const maidsCount = await Maid.countDocuments()

    const bookingsCount = await Booking.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ])

    const revenue = await Booking.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, totalRevenue: { $sum: '$price' } } }
    ])

    const reviewsCount = await Review.countDocuments()

    res.status(200).json({
      message: 'Statistics retrieved successfully.',
      statistics: {
        users: usersCount,
        maids: maidsCount,
        bookings: bookingsCount,
        revenue: revenue[0]?.totalRevenue || 0,
        reviews: reviewsCount
      }
    })
  } catch (error) {
    console.error('Error retrieving statistics:', error.message)
    res.status(500).json({ message: 'Internal server error.', error: error.message })
  }
}

export const getAllUsers = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied: Not an admin.' })
    }
    const users = await User.find()
    res.status(200).json({
      message: 'Users retrieved successfully.',
      users
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params

    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied: Only admins can delete users.' })
    }

    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({ message: 'User not found.' })
    }

    await User.deleteOne({ _id: userId });

    res.status(200).json({ message: 'User deleted successfully.' })
  } catch (error) {
    console.error('Error deleting user:', error.message)
    res.status(500).json({ message: 'Internal server error.', error: error.message })
  }
}

export const getAllBooking = async (req, res) => {
  try {
    const bookings = await Booking.find();
    res.status(200).json({ bookings });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi lấy danh sách bài đăng.', error: error.message });
  }
};

export const deleteBooking = async (req, res) => {
  try {
    const post = await Booking.findByIdAndDelete(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Không tìm thấy bài đăng.' });
    }
    res.status(200).json({ message: 'Xóa bài đăng thành công.' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi xóa bài đăng.', error: error.message });
  }
};