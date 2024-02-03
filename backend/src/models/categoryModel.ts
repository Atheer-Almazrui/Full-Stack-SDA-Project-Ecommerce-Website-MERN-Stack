import { Schema, model } from 'mongoose'

export interface ICategory extends Document {
  _id: string
  name: string
  slug: string
  createdAt?: Date
  updatedAt?: Date
  _v: number
}

const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlenght: [3, 'Category name length must be at least 3 charecters'],
      maxlength: [300, 'Category name length must be at most 100 charecters'],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      required: [true, 'category slug is required'],
    },
  },
  { timestamps: true }
)

// create the model/collections
export const Category = model<ICategory>('Category', categorySchema)
