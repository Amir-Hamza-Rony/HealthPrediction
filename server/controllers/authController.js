import Doctor from '../models/Doctor.js'
import User from '../models/User.js'

function inferRole(email) {
  if (email === 'admin@health.test') return 'admin'
  if (email === 'doctor@health.test') return 'doctor'
  return 'user'
}

function buildDoctorProfile(user, role) {
  if (role !== 'doctor') {
    return null
  }

  return {
    firebaseUid: user.firebaseUid,
    name: user.name,
    email: user.email,
    specialty: 'General Medicine',
    exp: '5 years',
    rating: 4.7,
    reviews: 0,
    location: 'HealthPrediction Clinic',
    availableDays: user.availableDays || [],
    fee: '500',
    img: '👨‍⚕️',
  }
}

export async function syncProfile(request, response) {
  const { user, desiredRole } = request.body || {}

  if (!user?.uid || !user?.email) {
    return response.status(400).json({ message: 'Invalid user payload' })
  }

  // Look up any existing user in the DB first so we can preserve their role
  const existingUser = await User.findOne({ firebaseUid: user.uid })

  // Role priority:
  //  1. desiredRole sent explicitly from the register form
  //  2. Existing DB role (preserve doctor/admin on subsequent logins — prevents overwrite)
  //  3. inferRole (special demo emails, or default to 'user')
  let role
  if (desiredRole && ['user', 'doctor', 'admin'].includes(desiredRole)) {
    role = desiredRole
  } else if (existingUser?.role) {
    role = existingUser.role
  } else {
    role = inferRole(user.email)
  }

  const payload = {
    firebaseUid: user.uid,
    name: user.name || user.email.split('@')[0],
    email: user.email,
    photoURL: user.photoURL || '',
    role,
  }

  let profile = await User.findOneAndUpdate(
    { firebaseUid: user.uid },
    { $set: payload, $setOnInsert: { availableDays: [] } },
    { new: true, upsert: true },
  )

  const doctorProfile = buildDoctorProfile(profile, role)
  if (doctorProfile) {
    await Doctor.findOneAndUpdate(
      { firebaseUid: profile.firebaseUid },
      { $set: doctorProfile },
      { new: true, upsert: true },
    )
  }

  profile = await User.findById(profile.id)

  return response.json({ user: profile })
}
