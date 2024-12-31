import mongoose from 'mongoose'

const MaidSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  age: { type: Number, required: true },
  experience: { type: Number, required: true },
  location: { type: String, required: true },
  ratings: { type: Number, default: 0 },
  totalRatings: { type: Number, default: 0 },
  totalScore: { type: Number, default: 0 },
  description: { type: String, default: '' },
  isFree: { type: Boolean, default: true }
}, { timestamps: true })

const Maid = mongoose.model('Maid', MaidSchema, 'maids')

export default Maid
