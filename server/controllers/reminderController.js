import MedicineReminder from '../models/MedicineReminder.js'

export async function listReminders(request, response) {
  const query = {}

  if (request.query.userId) {
    query.userId = request.query.userId
  }

  const reminders = await MedicineReminder.find(query).sort({ createdAt: -1 })
  return response.json({ reminders })
}

export async function createReminder(request, response) {
  const { userId, text, time = '' } = request.body || {}

  if (!userId || !text) {
    return response.status(400).json({ message: 'Missing reminder fields' })
  }

  const reminder = await MedicineReminder.create({ userId, text, time })
  return response.status(201).json({ reminder })
}
