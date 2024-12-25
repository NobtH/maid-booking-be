import mongoose from 'mongoose'

const ReviewSchema = new mongoose.Schema({
  bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
  maidId: { type: mongoose.Schema.Types.ObjectId, ref: 'Maid', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
  updateAt: { type: Date, default: Date.now }
})

const Review = mongoose.model('Review', ReviewSchema)

export default Review
