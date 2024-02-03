export interface Error {
  status?: number;
  message?: string;
}

export type EmailDataType = {
  email: string
  subject: string
  html: string
}

export  type UserType = {
  name: string
  email: string 
  password: string
  image?: string
  address: string
  phone: string
 
}

export interface TokenPayload {
  [key: string]: any
}
