import mongoose from 'mongoose';

const BookingSchema = new mongoose.Schema(
  {
    maidId: { type: mongoose.Schema.Types.ObjectId, ref: 'Maid', required: false }, // Maid nhận booking
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // User tạo booking
    date: { type: Date, required: true }, // Ngày booking
    hours: { type: Number, required: true }, // Số giờ làm việc
    price: { type: Number, required: true }, // Tổng giá
    location: { type: String, required: true }, // Địa điểm làm việc
    phone: { type: String, required: true }, // Số điện thoại người đặt
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'completed', 'cancelled'], // Trạng thái
      default: 'pending',
    },
  },
  { timestamps: true } // Tự động thêm `createdAt` và `updatedAt`
);

const Booking = mongoose.model('Booking', BookingSchema);

export default Booking;
