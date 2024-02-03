import { NextFunction, Request, Response } from 'express'

import * as authService from '../services/authService'
import { generateToken } from '../util/jsonWebToken'
import setAccessTokenCookie from '../util/cookieUtils'
import { createHttpError } from '../errors/createHttpError'
import User from '../models/userModel'

export const handleLogin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body

    const user = await authService.findUserByEmail(email)
    await authService.isPasswordMatch(user, password)
    await authService.isUserBanned(user)

    const accessToken = generateToken({ _id: user._id } , '1d') // Generate access token
    setAccessTokenCookie(res, accessToken) // Set the access token in a cookie

    res.status(200).json({ message: 'User is logged in successfully', payload: user })
  } catch (error) {
    next(error)
  }
}

export const handleLogout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.clearCookie('accessToken')
    res.status(200).json({ message: 'User is logged out successfully' })
  } catch (error) {
    next(error)
  }
}

export const grantRole = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, isAdmin } = req.body
    const user = await User.findOne({ email })
    if (!user) {
      throw createHttpError(404, `No user was found with the email: ${email}.`)
    }
    user.isAdmin = !isAdmin
    await user.save()

    res.status(200).json({ message: `Role granted successfully for ${email}` })
  } catch (error) {
    next(error)
  }
}
