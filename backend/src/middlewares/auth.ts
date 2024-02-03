import { NextFunction, Request, Response } from 'express'
import { JwtPayload } from 'jsonwebtoken'

import { createHttpError } from '../errors/createHttpError'
import { verifyToken } from '../util/jsonWebToken'
import User from '../models/userModel'

interface CustomRequest extends Request {
  userId?: string
}
export const isLoggedIn = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const accessToken = req.cookies.accessToken
    console.log("accessToken: " + accessToken)
    if (!accessToken) {
      throw createHttpError(401, 'You are not logged in!')
    }
    const decoded = (await verifyToken(accessToken)) as JwtPayload
    req.userId = decoded._id
    next()
  } catch (error) {
    next(error)
  }
}

export const isLoggedOut = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const accessToken = req.cookies.accessToken
    if (accessToken) {
      throw createHttpError(401, 'You are already logged in!')
    }
    next()
  } catch (error) {
    next(error)
  }
}

export const isAdmin = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.userId)
    if (user?.isAdmin) {
      next()
    } else {
      throw createHttpError(403, 'You are not admin!')
    }
  } catch (error) {
    next(error)
  }
}
