import mongoose from 'mongoose'

const MaidSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  age: { type: Number, required: true },
  experience: { type: Number, required: true },
  hourlyRate: { type: Number, required: true },
  location: { type: String, required: true },
  ratings: { type: [Number], default: [] },
  totalRatings: { type: Number, default: 0 },
  totalScore: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})

MaidSchema.virtual('averageRating').get(function () {
  return this.totalRatings > 0 ? this.totalScore / this.totalRatings : 0
})

const Maid = mongoose.model('Maid', MaidSchema)

export default Maid
