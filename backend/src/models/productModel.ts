//productModel.ts
import { Schema, model, Document } from 'mongoose'
import { ICategory } from './categoryModel'

export interface IProduct extends Document {
  name: string
  slug: string
  description: string
  quantity: number
  sold: number
  price: number
  image: string
  category: ICategory['_id']
  createdAt?: Date
  updatedAt?: Date
}

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: [3, 'Product name must be at least 3 characters long'],
      maxlength: [300, 'Product name must be at most 300 characters'],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      minlength: [3, 'Product description must be at least 3 characters long'],
    },
    quantity: {
      type: Number,
      default: 1,
      trim: true,
    },
    sold: {
      type: Number,
      default: 1,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      default: 'public/images/products/default.png',
    },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
  },
  { timestamps: true }
)

// create the model/collections
export const Product = model<IProduct>('Product', productSchema)
