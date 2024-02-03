import axios from 'axios'
import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit'

const baseURL = import.meta.env.VITE_APP_BASE_URL

export const fetchOrders = createAsyncThunk('order/fetchOrders', async () => {
  // try {
  //   const response = await axios.get('/api/orders/all-orders')
  //   return response.data.payload
  // } catch (error) {
  //   throw new Error('failed to fetch Orders')
  // }
})

export const fetchBraintreeToken = createAsyncThunk('order/fetchBraintreeToken', async () => {
  const response = await axios.get(`${baseURL}/api/orders/braintree/token`)
  return response.data
})

export const payWithBraintree = createAsyncThunk('order/payWithBraintree', async (data: object) => {
  try {
    const response = await axios.post('/api/orders/braintree/payment', data)
    return response.data
  } catch (error) {
    throw new Error('failed to pay')
  }
})

export type Order = {
  _id: string
  products: {
    product: string[]
  }
  payment: object
  buyer: string
  status: string
}

export type OrderState = {
  orders: Order[]
  error: null | string
  isLoading: boolean
}

const initialState: OrderState = {
  orders: [],
  error: null,
  isLoading: false
}

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    removeOrder: (state, action: { payload: { orderId: string } }) => {
      const filteredItems = state.orders.filter((order) => order._id !== action.payload.orderId)
      state.orders = filteredItems
    }
  },
  extraReducers: (builder) => {
    // builder
    //   .addCase(fetchOrders.pending, (state) => {
    //     state.isLoading = true
    //     state.error = null
    //   })
    //   .addCase(fetchOrders.fulfilled, (state, action: PayloadAction<Order[]>) => {
    //     state.isLoading = false
    //     state.orders = action.payload
    //   })
    //   .addCase(fetchOrders.rejected, (state, action) => {
    //     state.isLoading = false
    //     state.error = action.error.message || 'There is an error'
    //   })
  }
})

export const { removeOrder } = orderSlice.actions

export default orderSlice.reducer
