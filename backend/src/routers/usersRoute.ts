import { Router } from 'express'

import {
  createUser,
  deleteSingUser,
  getAllUsers,
  getSingleUser,
  processRegisterUser,
  updateUser,
  activateUser,
  banUser,
  unBanUser,
  forgetPassword,
  resetPassword,
} from '../controllers/userController'
import { uploadImageUser } from '../middlewares/uploadFile'
import { userValidator } from '../validator/userValidator'
import { isAdmin, isLoggedIn, isLoggedOut } from '../middlewares/auth'

const router = Router()

router.post(
  '/process-register',
  uploadImageUser.single('image'),
  userValidator,
  isLoggedOut,
  processRegisterUser
)
router.post('/activate', activateUser)
router.post('/', uploadImageUser.single('image'), userValidator, createUser)
router.post('/forget-password', isLoggedOut, forgetPassword)
router.put('/reset-password', isLoggedOut, resetPassword)

router.get('/', isLoggedIn, isAdmin, getAllUsers)
router.get('/:email', isLoggedIn, isAdmin, getSingleUser)

router.delete('/:email', isLoggedIn, isAdmin, deleteSingUser)
router.put('/:email', uploadImageUser.single('image'),
 //userValidator, 
 updateUser)
router.put('/ban/:email', isLoggedIn, isAdmin, banUser)
router.put('/unban/:email', isLoggedIn, isAdmin, unBanUser)

export default router
