// sw.js — place this in your /public folder

self.addEventListener('install', () => self.skipWaiting())
self.addEventListener('activate', () => self.clients.claim())

// Listen for scheduled reminder messages from the app
self.addEventListener('message', (event) => {
  const { type, reminders } = event.data || {}
  if (type !== 'SCHEDULE_REMINDERS' || !Array.isArray(reminders)) return

  // Clear any previously scheduled alarms by storing them
  self.scheduledTimers = self.scheduledTimers || []
  self.scheduledTimers.forEach(id => clearTimeout(id))
  self.scheduledTimers = []

  reminders.forEach(reminder => {
    if (!reminder.time) return

    const [hours, minutes] = reminder.time.split(':').map(Number)

    const now = new Date()
    const target = new Date()
    target.setHours(hours, minutes, 0, 0)

    // 5 minutes before
    const notifyAt = new Date(target.getTime() - 5 * 60 * 1000)

    // If already passed today, schedule for tomorrow
    if (notifyAt <= now) notifyAt.setDate(notifyAt.getDate() + 1)

    const delay = notifyAt.getTime() - now.getTime()

    const id = setTimeout(() => {
      self.registration.showNotification('💊 Medicine Reminder', {
        body: `${reminder.text} — ৫ মিনিট পরে খাওয়ার সময়!`,
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        tag: `reminder-${reminder.id}`,
        requireInteraction: true,
        vibrate: [200, 100, 200],
        data: { reminderId: reminder.id },
      })
    }, delay)

    self.scheduledTimers.push(id)
  })
})

// Notification click — focus app
self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
      if (list.length > 0) return list[0].focus()
      return clients.openWindow('/')
    })
  )
})
