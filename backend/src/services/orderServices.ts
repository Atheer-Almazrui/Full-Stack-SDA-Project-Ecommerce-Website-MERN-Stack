import { NextFunction } from 'express'
import { IOrder, IOrderProduct, Order } from '../models/orderModel'
import { ObjectId } from 'mongoose'

interface CustomRequest extends Request {
  userId?: string
}

export const getAllOrders = async () => {
  const orders = await Order.find()
    .populate({
      path: 'products',
      populate: { path: 'product', select: 'name price category quantity' },
    })
    .populate('buyer', 'name email phone')
  return orders
}

export const getOrderById = async (userId: string) => {
  const orders = await Order.find({ buyer: userId })
    .populate({
      path: 'products',
      populate: { path: 'product', select: 'name price category quantity' },
    })
    .populate('buyer', 'name email phone')
  return orders
}
