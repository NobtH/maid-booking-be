import mongoose from 'mongoose';

const BookingSchema = new mongoose.Schema(
  {
    maidId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, required: true },
    from: { type: String, required: true },
    to: { type: String, required: true },
    price: { type: Number, required: true },
    location: { type: String, required: true },
    phone: { type: String, required: true },
    description: { type: String, default: '' },
    title: { type: String, default: 'Tìm người giúp việc' },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'completed', 'cancelled'],
      default: 'pending',
    },
    isReviewed: { type: Boolean, default: false }
  },
  { timestamps: true }
)

const Booking = mongoose.model('Booking', BookingSchema);

export default Booking;
