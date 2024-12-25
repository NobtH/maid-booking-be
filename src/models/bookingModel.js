import mongoose from 'mongoose'

const BookingSchema = new mongoose.Schema({
  maidId: { type: mongoose.Schema.Types.ObjectId, ref: 'Maid', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date },
  hours: { type: Number, required: true },
  price: { type: Number, required: true },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled'],
    default: 'pending'
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})

const Booking = mongoose.model('Booking', BookingSchema)

export default Booking