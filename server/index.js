import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import process from 'node:process'
import { connectDatabase } from './config/db.js'
import authRoutes from './routes/authRoutes.js'
import appointmentRoutes from './routes/appointmentRoutes.js'
import doctorRoutes from './routes/doctorRoutes.js'
import reminderRoutes from './routes/reminderRoutes.js'
import userRoutes from './routes/userRoutes.js'
import aiRoutes from './routes/aiRoutes.js'

dotenv.config()

const app = express()
const port = process.env.PORT || 5000

app.use(cors({ origin: true }))
app.use(express.json({ limit: '2mb' }))

app.get('/api/health', (_, response) => {
  response.json({ ok: true, service: 'HealthPrediction API' })
})

app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/doctors', doctorRoutes)
app.use('/api/appointments', appointmentRoutes)
app.use('/api/reminders', reminderRoutes)
app.use('/api/ai', aiRoutes)

app.use((error, request, response, next) => {
  console.error(error)
  void next
  response.status(500).json({ message: error.message || 'Internal server error' })
})

async function startServer() {
  await connectDatabase()
  app.listen(port, () => {
    console.log(`API server running on http://localhost:${port}`)
  })
}

startServer().catch(error => {
  console.error('Failed to start API server', error)
  process.exit(1)
})
