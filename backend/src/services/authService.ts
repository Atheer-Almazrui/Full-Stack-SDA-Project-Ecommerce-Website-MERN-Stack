import bcrypt from 'bcrypt'

import User, { IUser } from '../models/userModel'
import { createHttpError } from '../errors/createHttpError'

export const findUserByEmail = async (email: string) => {
  const user = await User.findOne({ email })
  if (!user) {
    throw createHttpError(404, `User not found with the email ${email}`)
  }
  return user
}

export const isPasswordMatch = async (user: IUser, password: string) => {
  const isPasswordMatch = await bcrypt.compare(password, user.password)
  if (!isPasswordMatch) {
    throw createHttpError(401, `Password doesn't match with this email ${user.email}`)
  }
}

export const isEmailMatch = async (inputEmail: string) => {
  const user = await User.findOne({ email: inputEmail })
  if (!user) {
    throw createHttpError(404, 'Their is no match with this email adress')
  }
  return user
}

export const isUserBanned = (user: IUser) => {
  if (user.isBanned) {
    throw createHttpError(
      403,
      `User is banned with this email ${user.email}. Please contact the admin`
    )
  }
}
