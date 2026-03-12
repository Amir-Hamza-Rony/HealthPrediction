import mongoose from 'mongoose'
import { withClientTransform } from '../utils/withClientTransform.js'

const userSchema = new mongoose.Schema(
  {
    firebaseUid: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, index: true },
    photoURL: { type: String, default: '' },
    role: { type: String, enum: ['user', 'doctor', 'admin'], default: 'user' },
    availableDays: { type: [String], default: [] },
  },
  { timestamps: true },
)

withClientTransform(userSchema)

export default mongoose.model('User', userSchema)
