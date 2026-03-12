import Doctor from '../models/Doctor.js'
import User from '../models/User.js'

function attachDoctorAvailability(user, availableDays) {
  if (user.role !== 'doctor') {
    return Promise.resolve(null)
  }

  return Doctor.findOneAndUpdate(
    { firebaseUid: user.firebaseUid },
    {
      $set: {
        firebaseUid: user.firebaseUid,
        name: user.name,
        email: user.email,
        availableDays,
      },
    },
    { new: true, upsert: true },
  )
}

export async function listUsers(request, response) {
  const users = await User.find().sort({ createdAt: -1 })
  return response.json({ users })
}

export async function updateUserRole(request, response) {
  const { role } = request.body || {}

  if (!['user', 'doctor', 'admin'].includes(role)) {
    return response.status(400).json({ message: 'Invalid role' })
  }

  const user = await User.findByIdAndUpdate(
    request.params.id,
    { $set: { role } },
    { new: true },
  )

  if (!user) {
    return response.status(404).json({ message: 'User not found' })
  }

  if (role === 'doctor') {
    await attachDoctorAvailability(user, user.availableDays || [])
  }

  const users = await User.find().sort({ createdAt: -1 })
  return response.json({ user, users })
}

export async function updateAvailability(request, response) {
  const { availableDays = [] } = request.body || {}

  const user = await User.findByIdAndUpdate(
    request.params.id,
    { $set: { availableDays } },
    { new: true },
  )

  if (!user) {
    return response.status(404).json({ message: 'User not found' })
  }

  await attachDoctorAvailability(user, availableDays)

  return response.json({ user })
}
