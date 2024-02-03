import { Response } from 'express'

const setAccessTokenCookie = (res: Response, accessToken: string) => {
  res.cookie('accessToken', accessToken, {
    maxAge: 30 * 60 * 1000,
    httpOnly: true,
    sameSite: 'none',
    secure: true,
  })
}

export default setAccessTokenCookie
