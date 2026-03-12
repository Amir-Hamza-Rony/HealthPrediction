import mongoose from 'mongoose'
import { withClientTransform } from '../utils/withClientTransform.js'

const appointmentSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    userName: { type: String, required: true },
    userEmail: { type: String, default: '' },
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true, index: true },
    doctorUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null, index: true },
    doctorFirebaseUid: { type: String, default: '', index: true },
    doctorEmail: { type: String, default: '', index: true },
    doctorName: { type: String, required: true },
    doctorSpecialty: { type: String, default: '' },
    day: { type: String, required: true },
    time: { type: String, required: true },
    notes: { type: String, default: '' },
    status: { type: String, enum: ['upcoming', 'completed', 'cancelled'], default: 'upcoming' },
  },
  { timestamps: true },
)

withClientTransform(appointmentSchema)

export default mongoose.model('Appointment', appointmentSchema)
