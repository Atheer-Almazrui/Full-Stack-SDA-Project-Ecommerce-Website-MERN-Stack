import { NextFunction, Request, Response } from 'express'
import { JsonWebTokenError, JwtPayload, TokenExpiredError } from 'jsonwebtoken'
import { validationResult } from 'express-validator'
import bcrypt from 'bcrypt'

import User from '../models/userModel'
import { createHttpError } from '../errors/createHttpError'
import { handelSendEmail } from '../helper/sendEmail'
import * as userService from '../services/userService'
import { generateToken, verifyToken } from '../util/jsonWebToken'
import { deleteImage } from '../helper/deleteImage'

export const processRegisterUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email } = req.body
    const imagePath = req.file?.path

    const isUserExists = await User.exists({ email: email })
    if (isUserExists) {
      imagePath && deleteImage(imagePath, 'users')
      throw createHttpError(409, `User already exist with the email ${email}`)
    }

    // Check for validation errors
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      imagePath && deleteImage(imagePath, 'users')
      return res.status(400).json({ errors: errors.array() })
    }

    // User doesn't exist, continue with registration process
    const tokenPayload = await userService.createTokenPayload(req.body, imagePath)
    const token = generateToken(tokenPayload, '1d')

    const emailData = await userService.createEmailData(name, email, token, 'activate')
    await handelSendEmail(emailData)

    res.status(200).json({
      message: 'Check your email to activate your account',
    })
  } catch (error) {
    next(error)
  }
}

export const activateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.body.token
    if (!token) {
      throw createHttpError(404, `Please provide a token !`)
    }

    const decoded = verifyToken(token)
    await User.create(decoded)

    res.status(201).json({
      message: 'User account Successfully activated',
    })
  } catch (error) {
    if (error instanceof TokenExpiredError || error instanceof JsonWebTokenError) {
      const errorMessage =
        error instanceof TokenExpiredError ? 'Your token has expired!' : 'Invalid token'
      next(createHttpError(401, errorMessage))
    } else {
      next(error)
    }
  }
}

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const isUserExists = await User.exists({ email: req.body.email })
    if (isUserExists) {
      req.file?.path && deleteImage(req.file.path, 'users')
      throw createHttpError(409, `User already exist with the email ${req.body.email}`)
    }

    // Check for validation errors
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      req.file?.path && deleteImage(req.file.path, 'users')
      return res.status(400).json({ errors: errors.array() })
    }

    const { name, email, password, address, phone } = req.body
    const imagePath = req.file?.path
    const hashedPassword = await bcrypt.hash(password, 10)
    const newUser = new User({
      name: name,
      email: email,
      password: hashedPassword,
      address: address,
      phone: phone,
      image: imagePath,
    })
    await newUser.save()

    res.status(201).json({
      message: 'Successfully created user',
    })
  } catch (error) {
    next(error)
  }
}

export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 4
    const sort = req.query.sort as string
    const search = req.query.search as string

    const { users, totalPages, currentPage, count } = await userService.getUsers(
      page,
      limit,
      sort,
      search
    )

 if (users.length > 0) {
   res.send({
     message: 'return all the users',
     payload: {
       users,
       pagination: {
         totalPages,
         currentPage,
         totalUsers: count,
       },
     },
   })
 } else {
   res.status(200).send({
     message: 'users is empty',
     payload: {
       users: [],
       pagination: {
         totalPages: 1,
         currentPage: 1,
         totalUsers: 0,
       },
     },
   })
 }
  } catch (error) {
    next(error)
  }
}

export const getSingleUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const email = req.params.email
    const user = await userService.getUser(email)

    res.status(200).json({ message: 'User found successfully', user })
  } catch (error) {
    next(error)
  }
}

export const deleteSingUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const email = req.params.email
    const user = await userService.deleteUserByEmail(email)

    // to delete the image from the public/images/users folder
    user && deleteImage(user.image, 'users')

    res.status(200).json({ message: 'User deleted successfully', user })
  } catch (error) {
    next(error)
  }
}

export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.params
    const updatedUser = { ...req.body, image: req.file?.path }
    console.log('updated user', req.body)
    const emailExists = await User.exists({ email: updatedUser.email })

    // Check for validation errors
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      updatedUser.image && deleteImage(updatedUser.image, 'users')
      return res.status(400).json({ errors: errors.array() })
    }

    // to delete the image from the public/images/users folder
    const prevUserData = await User.findOne({ email })
    req.file?.path && prevUserData && deleteImage(prevUserData.image, 'users')

    const user = await userService.updateUserByEmail(email, updatedUser)

    res.status(200).send({ message: 'User is updated', payload: user })
  } catch (error) {
    next(error)
  }
}

export const banUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const email = req.params.email
    await userService.updateBanStatus(email, true)
    res.status(200).json({ message: 'Banned the User successfully' })
  } catch (error) {
    next(error)
  }
}

export const unBanUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const email = req.params.email
    await userService.updateBanStatus(email, false)
    res.status(200).json({ message: 'Unbanned the User successfully' })
  } catch (error) {
    next(error)
  }
}

export const forgetPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body
    const user = await User.findOne({ email: email })

    if (!user) {
      throw createHttpError(
        409,
        `User email does not exists. Please register yourself first`
      )
    }
    const token = generateToken({ email }, '10m')

    const emailData = await userService.createEmailData(user.name, email, token, 'reset-password')
    await handelSendEmail(emailData)

    res.status(200).json({
      message: 'Check your email to reset your password',
      token: token,
    })
  } catch (error) {
    next(error)
  }
}
export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token, password } = req.body
    const decoded = verifyToken(token) as JwtPayload
    const updatePassowrd = await User.findOneAndUpdate(
      { email: decoded.email },
      { $set: { password: bcrypt.hashSync(password, 10) } }
    )

    if (!updatePassowrd) {
      throw createHttpError(
        400,
        `Reset your password was unsuccessfully with the email ${decoded.email}`
      )
    }
    res.status(200).json({
      message: 'Reset your password was successfully',
    })
  } catch (error) {
    next(error)
  }
}
