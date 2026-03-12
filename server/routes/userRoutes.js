import { Router } from 'express'
import { listUsers, updateAvailability, updateUserRole } from '../controllers/userController.js'

const router = Router()

router.get('/', listUsers)
router.patch('/:id/role', updateUserRole)
router.patch('/:id/availability', updateAvailability)

export default router
