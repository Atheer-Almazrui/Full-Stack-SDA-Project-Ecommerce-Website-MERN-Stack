import { NextFunction, Request, Response } from 'express'
import braintree from 'braintree'
import { dev } from '../config'

import { IOrder, IOrderProduct, Order } from '../models/orderModel'
import { createHttpError } from '../errors/createHttpError'
import * as orderServices from '../services/orderServices'

const gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: dev.app.braintreeMerchantId,
  publicKey: dev.app.braintreePublicKey,
  privateKey: dev.app.braintreePrivateKey,
})

export interface CustomRequest extends Request {
  userId?: string
}

export const getAllOrdersForAdmin = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const orders = await orderServices.getAllOrders()
    res.send({ message: 'Orders are returned for the admin', payload: orders })
  } catch (error) {
    next(error)
  }
}

export const handleProcessPayment = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { cartItems, payment } = req.body
    const newOrder: IOrder = new Order({
      products:
        cartItems.products.length > 0 &&
        cartItems.products.map((item: IOrderProduct) => ({
          product: item.product,
          //quantity: item.quantity,
        })),
      payment: cartItems.payment,
      buyer: req.userId,
    })
    await newOrder.save()
    res.send({ message: 'payment was successful and order is created' })
  } catch (error) {
    next(error)
  }
}

export const getOrderForUser = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.params.id
    const orders = await orderServices.getOrderById(userId)
    res.send({ message: 'Orders are returned for the user', payload: orders })
  } catch (error) {
    next(error)
  }
}

export const updateOrderStatus = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const orderId = req.params.id
    const { status } = req.body
    const updateStatus = await Order.findOneAndUpdate(
      { _id: orderId },
      { $set: { status: status } },
      { new: true }
    )

    if (!updateStatus) {
      throw createHttpError(400, `Updated status was unsuccessfully with the status ${status}`)
    }
    res.status(200).json({
      message: 'The status was updated successfully',
      payload: updateStatus,
    })
  } catch (error) {
    next(error)
  }
}

export const generateBraintreeClientToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const braintreeClientToken = await gateway.clientToken.generate({})
    if (!braintreeClientToken) {
      throw createHttpError(400, 'braintree token was not generated')
    }
    res.status(200).json(braintreeClientToken)
  } catch (error) {
    next(error)
  }
}

export const handleBraintreePayment = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { nonce, cartItems, amount } = req.body
    const result = await gateway.transaction.sale({
      amount: amount,
      paymentMethodNonce: nonce,
      options: {
        submitForSettlement: true,
      },
    })
    if (result.success) {
      const order = new Order({
        products: {
          product: cartItems,
        },
        payment: result,
        buyer: req.userId,
      })
      await order.save()
    } else {
      throw new Error(result.message)
    }
    return res.status(201).json({
      message: 'Order is created successfully',
    })
  } catch (error) {
    next(error)
  }
}
