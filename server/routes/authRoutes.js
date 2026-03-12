import { Router } from 'express'
import { syncProfile } from '../controllers/authController.js'

const router = Router()

router.post('/sync', syncProfile)

export default router
