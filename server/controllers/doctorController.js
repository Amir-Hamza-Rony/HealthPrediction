import Doctor from '../models/Doctor.js'
import { fallbackDoctors } from '../data/fallbackDoctors.js'

async function seedDoctorsIfNeeded() {
  const count = await Doctor.countDocuments()
  if (count > 0) {
    return
  }

  await Doctor.insertMany(
    fallbackDoctors.map(doctor => ({
      ...doctor,
      isSeeded: true,
    })),
  )
}

export async function listDoctors(request, response) {
  await seedDoctorsIfNeeded()
  const doctors = await Doctor.find().sort({ rating: -1, createdAt: -1 })
  return response.json({ doctors })
}
