import jwt from 'jsonwebtoken'

import { dev } from '../config'
import { TokenPayload } from '../types'
import { createHttpError } from '../errors/createHttpError'

// Function to generate a JSON Web Token (JWT) based on a token payload and optional expiration time
export const generateToken = (tokenPayload: TokenPayload, expiresIn = ''): string => {
  try {
    if (!tokenPayload || Object.keys(tokenPayload).length === 0) {
      throw new Error('tokenPayload must be a non-empty object')
    }
    const token = jwt.sign(tokenPayload, String(dev.app.jwtUserKey), {
      expiresIn: expiresIn,
    })
    return token
  } catch (error) {
    throw error
  }
}
// Function to verify the validity of a JWT and decode its payload
export const verifyToken = (token: string) => {
  const decoded = jwt.verify(token, String(dev.app.jwtUserKey))
  if (!decoded) {
    throw createHttpError(401, 'Invalid token or token expired')
  }
  return decoded
}

// Function to create a JSON Web Token (JWT) with a custom secret key and optional expiration time
export const createJSONWebToken = (tokenPayload: object, secretKey: string, expiresIn = '') => {
  try {
    if (!tokenPayload || Object.keys(tokenPayload).length === 0) {
      throw new Error('tokenPayload must be a non-empty object')
    }
    if (typeof secretKey !== 'string' || secretKey === '') {
      throw new Error('secretKey must be a non-empty string')
    }
    const token = jwt.sign(tokenPayload, secretKey, {
      expiresIn: expiresIn,
    })
    return token
  } catch (error) {
    throw error
  }
}

// export const verifyJSONWebToken = (token: string, secretKey: string) => {
//   try {
//     const decoded = jwt.verify(token, secretKey)
//     return decoded
//   } catch (error) {
//     throw new Error('Invalid token')
//   }
// }
