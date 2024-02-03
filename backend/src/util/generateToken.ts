import jwt from 'jsonwebtoken'

import { dev } from '../config'
import { TokenPayload } from '../types'
import { createHttpError } from '../errors/createHttpError'

export const generateToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, String(dev.app.jwtUserKey), {
    expiresIn: '10m',
  })
}

export const verifyToken = (token: string) => {
  const decoded = jwt.verify(token, String(dev.app.jwtUserKey))
  if (!decoded) {
    throw createHttpError(401, 'Invalid token or token expired')
  }

  return decoded
}
