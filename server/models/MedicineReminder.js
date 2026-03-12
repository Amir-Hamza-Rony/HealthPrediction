import mongoose from 'mongoose'
import { withClientTransform } from '../utils/withClientTransform.js'

const reminderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    text: { type: String, required: true, trim: true },
    time: { type: String, default: '' },
    completed: { type: Boolean, default: false },
  },
  { timestamps: true },
)

withClientTransform(reminderSchema)

export default mongoose.model('MedicineReminder', reminderSchema)
