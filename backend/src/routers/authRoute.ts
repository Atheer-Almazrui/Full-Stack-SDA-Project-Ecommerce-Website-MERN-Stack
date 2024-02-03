import { Router } from 'express'

import { grantRole, handleLogin, handleLogout } from '../controllers/authController'
import { isLoggedOut } from '../middlewares/auth'

const router = Router()

router.post('/login', isLoggedOut, handleLogin)
router.post('/logout', handleLogout)
router.patch('/grant-role', grantRole)

export default router
