import mongoose from 'mongoose'

const BookingSchema = new mongoose.Schema(
  {
    maidId: { type: mongoose.Schema.Types.ObjectId, ref: 'Maid', required: false },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, required: true },
    hours: { type: Number, required: true },
    price: { type: Number, required: true },
    location: { type: String, required: true },
    phone: { type: String, required: true },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'completed', 'cancelled'],
      default: 'pending'
    }
  },
  { timestamps: true }
)

const Booking = mongoose.model('Booking', BookingSchema)

export default Booking
