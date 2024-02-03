declare namespace Express {
  interface Request {
    msg: string
    user: {
      id: string
      first_name: string
    }
  }
}
