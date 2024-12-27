import bcrypt from 'bcrypt'
import User from '~/models/userModel'
import Maid from '~/models/maidModel.js'
import jwt from 'jsonwebtoken'
import { hashPassword } from '~/helpers/authHelper'

export const registerController = async (req, res) => {
  try {
    const { name, email, password, phone, address, role, age, experience, hourlyRate, location } = req.body

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists.' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      address,
      role
    })

    let maid = null
    if (role === 'maid') {
      if (!age || !experience || !hourlyRate || !location) {
        return res.status(400).json({ message: 'Missing maid-specific fields.' })
      }

      maid = await Maid.create({
        userId: user._id,
        age,
        experience,
        hourlyRate,
        location
      })
    }

    res.status(201).json({
      message: 'Registration successful.',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      ...(maid && { maid })
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body

    // Kiểm tra nếu email hoặc password không được cung cấp
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' })
    }

    // Tìm người dùng theo email
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({ message: 'Invalid email' })
    }

    // So sánh mật khẩu
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password.' })
    }

    // Tạo JWT token
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
        email: user.email
      },
      process.env.JWT_SECRET, // Đảm bảo bạn đã cấu hình `JWT_SECRET` trong `.env`
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' } // Thời gian hết hạn token
    )

    // Trả về kết quả
    res.status(200).json({
      message: 'Login successful.',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const forgotPasswordController = async (req, res) => {
  try {
    const { email, answer, newPassword } = req.body
    if (!email) {
      res.status(400).send({ message: 'Email is required' })
    }
    if (!answer) {
      res.status(400).send({ message: 'Answer is required' })
    }
    if (!newPassword) {
      res.status(400).send({ message: 'New Password is required' })
    }
    // Check user
    const user = await User.findOne({ email, answer })
    if (!user) {
      return res.status(404).send({
        success: false,
        message: 'Wrong Email or Answer'
      })
    }
    // Hash new password
    const hashed = await hashPassword(newPassword)
    await User.findByIdAndUpdate(user._id, { password: hashed })
    res.status(200).send({
      success: true,
      message: 'Password Reset Successfully'
    })
  } catch (error) {
    res.status(500).send({
      success: false,
      message: 'Something went wrong',
      error
    })
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
    const { userId } = req.params // Lấy `userId` từ URL

    // Kiểm tra nếu người dùng không phải admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied: Only admins can delete users.' })
    }

    // Tìm và xóa người dùng
    const deletedUser = await User.findByIdAndDelete(userId)

    // Nếu người dùng không tồn tại
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found.' })
    }

    // Trả về kết quả thành công
    res.status(200).json({
      message: 'User deleted successfully.',
      deletedUser: {
        id: deletedUser._id,
        name: deletedUser.name,
        email: deletedUser.email
      }
    })
  } catch (error) {
    console.error('Error deleting user:', error.message)
    res.status(500).json({ message: 'Internal server error.' })
  }
}

export const updateProfile = async (req, res) => {
  try {
    const { name, phone, address, password, age, experience, hourlyRate, location } = req.body

    // Xác thực người dùng từ token
    const userId = req.user.id

    // Kiểm tra nếu người dùng gửi mật khẩu mới
    let updatedData = { name, phone, address }
    if (password) {
      if (password.length < 6) {
        return res.status(400).json({ message: 'Password must be at least 6 characters.' })
      }
      const bcrypt = require('bcrypt')
      updatedData.password = await bcrypt.hash(password, 10)
    }

    // Cập nhật thông tin cơ bản của người dùng
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updatedData },
      { new: true, runValidators: true }
    )

    // Nếu người dùng không tồn tại
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found.' })
    }

    // Nếu người dùng là maid, cập nhật thêm thông tin maid
    let updatedMaid = null
    if (updatedUser.role === 'maid') {
      let maidData = {}
      if (age) maidData.age = age
      if (experience) maidData.experience = experience
      if (hourlyRate) maidData.hourlyRate = hourlyRate
      if (location) maidData.location = location

      updatedMaid = await Maid.findOneAndUpdate(
        { userId },
        { $set: maidData },
        { new: true, runValidators: true }
      )
    }

    res.status(200).json({
      message: 'Profile updated successfully.',
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        address: updatedUser.address,
        ...(updatedUser.role === 'maid' && { maid: updatedMaid })
      }
    })
  } catch (error) {
    console.error('Error updating profile:', error.message)
    res.status(500).json({ message: 'Internal server error.', error: error.message })
  }
}