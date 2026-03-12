import mongoose from 'mongoose'
import { withClientTransform } from '../utils/withClientTransform.js'

const doctorSchema = new mongoose.Schema(
  {
    firebaseUid: { type: String, default: '', index: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, default: '', index: true },
    specialty: { type: String, default: 'সাধারণ চিকিৎসক' },
    exp: { type: String, default: '৫ বছর' },
    rating: { type: Number, default: 4.7 },
    reviews: { type: Number, default: 0 },
    location: { type: String, default: 'ঢাকা' },
    availableDays: { type: [String], default: [] },
    fee: { type: String, default: '500' },
    img: { type: String, default: '👨‍⚕️' },
    isSeeded: { type: Boolean, default: false },
  },
  { timestamps: true },
)

withClientTransform(doctorSchema)

export default mongoose.model('Doctor', doctorSchema)
