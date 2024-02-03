import { Request, Response, NextFunction } from 'express'

import { Error } from '../types'

export const errorHandler = (error: Error, req: Request, res: Response, next: NextFunction) => {
  return res.status(error.status || 500).send({
    message: error.message,
  })
}

// import { NextFunction, Request, Response } from 'express'
// import ApiError from '../errors/ApiError'

// const apiErrorHandler = (err: typeof ApiError, req: Request, res: Response, next: NextFunction) => {
//   if (err instanceof ApiError) {
//     res.status(err.code).json({ msg: err.message })
//     return
//   }

//   res.status(500).json({ msg: 'Something went wrong.' })
// }

// export default apiErrorHandler
