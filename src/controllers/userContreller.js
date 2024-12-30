import User from '../models/userModel.js';

export const getNameById = async (req, res) => {
    try {
      const { id } = req.params; // Lấy ID từ URL params
      const user = await User.findById(id); // Tìm user theo ID
      if (!user) {
        return res.status(404).json({ message: 'Người dùng không tồn tại.' });
      }
      res.status(200).json({ name: user.name });
    } catch (error) {
      console.error('Error fetching user name:', error.message);
      res.status(500).json({ message: 'Lỗi hệ thống.', error: error.message });
    }
  };
  