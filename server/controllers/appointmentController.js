import Appointment from '../models/Appointment.js'
import Doctor from '../models/Doctor.js'
import User from '../models/User.js'

export async function listAppointments(request, response) {
  const query = {}

  if (request.query.userId) {
    query.userId = request.query.userId
  }

  if (request.query.doctorId) {
    query.doctorId = request.query.doctorId
  }

  const appointments = await Appointment.find(query).sort({ createdAt: -1 })
  return response.json({ appointments })
}

export async function createAppointment(request, response) {
  const { userId, userName, userEmail, doctorId, doctorName, doctorEmail, doctorSpecialty, day, time, notes = '' } = request.body || {}

  if (!userId || !doctorId || !day || !time || !doctorName) {
    return response.status(400).json({ message: 'Missing appointment fields' })
  }

  // Determine the canonical doctorId to store on the appointment.
  // If the provided doctorId is a User._id for a doctor account, use that.
  // Otherwise, if it's a Doctor._id, try to find a linked User by firebaseUid
  // and use the User._id so doctor dashboards (which filter by User.id) work.
  let storedDoctorId = doctorId
  let storedDoctorUserId = null
  let storedDoctorFirebaseUid = ''
  let storedDoctorEmail = doctorEmail || ''
  let specialty = doctorSpecialty || ''

  // Check if doctorId references a User record first
  try {
    const doctorUser = await User.findById(doctorId)
    if (doctorUser && doctorUser.role === 'doctor') {
      storedDoctorId = doctorUser.id
      storedDoctorUserId = doctorUser.id
      storedDoctorFirebaseUid = doctorUser.firebaseUid || ''
      storedDoctorEmail = doctorUser.email || storedDoctorEmail
      specialty = doctorSpecialty || ''
    } else {
      // Fallback: treat doctorId as a Doctor._id
      const doctorDoc = await Doctor.findById(doctorId)
      if (!doctorDoc) {
        return response.status(404).json({ message: 'Doctor not found' })
      }

      specialty = doctorSpecialty || doctorDoc.specialty
      storedDoctorEmail = doctorDoc.email || storedDoctorEmail
      // If the Doctor doc has a firebaseUid, try to find the corresponding User
      if (doctorDoc.firebaseUid) {
        const linkedUser = await User.findOne({ firebaseUid: doctorDoc.firebaseUid })
        if (linkedUser) {
          storedDoctorId = linkedUser.id
          storedDoctorUserId = linkedUser.id
          storedDoctorFirebaseUid = linkedUser.firebaseUid || doctorDoc.firebaseUid || ''
          storedDoctorEmail = linkedUser.email || storedDoctorEmail
        } else {
          storedDoctorId = doctorDoc.id
          storedDoctorFirebaseUid = doctorDoc.firebaseUid || ''
        }
      } else {
        storedDoctorId = doctorDoc.id
      }
    }
  } catch (err) {
    return response.status(500).json({ message: 'Unable to resolve doctor identity' })
  }

  const appointment = await Appointment.create({
    userId,
    userName,
    userEmail,
    doctorId: storedDoctorId,
    doctorUserId: storedDoctorUserId,
    doctorFirebaseUid: storedDoctorFirebaseUid,
    doctorEmail: storedDoctorEmail,
    doctorName,
    doctorSpecialty: specialty,
    day,
    time,
    notes,
  })

  return response.status(201).json({ appointment })
}
