import { Schema, model, Document } from 'mongoose'

import { dev } from '../config'
export interface IUser extends Document {
  name: string
  email: string
  password: string
  image: string
  address: string
  phone: string
  isAdmin: boolean
  isBanned: boolean
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'Please give the name'],
      trim: true,
      minlength: [3, 'User name must be at least 3 characters long'],
      maxlength: [300, 'User name must be at most 300 characters'],
    },
    email: {
      type: String,
      unique: true,
      required: [true, 'Please give the email address'],
      trim: true,
      lowercase: true,
      validate: {
        validator: function (value: string) {
          return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value)
        },
      },
    },
    password: {
      type: String,
      required: [true, 'Please give the password'],
      trim: true,
      minlength: [6, 'The password must be at least 6 characters long'],
    },
    image: {
      type: String,
      default: 'public/images/users/default.png',
    },
    address: {
      type: String,
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Please give the phone number'],
      trim: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    isBanned: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
)

const User = model<IUser>('User', userSchema)

export default User
