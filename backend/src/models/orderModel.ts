import { Schema, model, Document } from 'mongoose'

import { IProduct } from './productModel'
import { IUser } from './userModel'

export interface IOrderProduct {
  product: IProduct['_id']
  //quantity: number
}

export interface IOrderPayment {}

export interface IOrder extends Document {
  products: IOrderProduct[]
  payment: IOrderPayment
  buyer: IUser['_id']
  status: 'Not Processed' | 'Processing' | 'Shipped' | 'Delivered' | 'Canceled'
}

const orderSchema = new Schema<IOrder>(
  {
    products: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        //quantity: { type: Number, required: true, trim: true },
      },
    ],
    payment: { type: Object, required: true },
    buyer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    status: {
      type: String,
      enum: ['Not Processed', 'Processing', 'Shipped', 'Delivered', 'Canceled'],
      default: 'Not Processed',
    },
  },
  { timestamps: true }
)

export const Order = model<IOrder>('Order', orderSchema)

