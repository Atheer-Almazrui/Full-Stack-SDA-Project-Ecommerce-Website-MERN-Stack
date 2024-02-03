import axios from 'axios'

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { Category } from '../categories/categorySlice'

const baseURL = import.meta.env.VITE_APP_BASE_URL

export type Product = {
  _id: string
  name: string
  slug: string
  image: string
  description: string
  sold: string
  category: Category
  price: string
  quantity: string
}

export type ProductState = {
  products: Product[]
  pagination: {
    totalPages: number
    currentPage: number
    totalProducts: number
  }
  error: null | string
  isLoading: boolean
  searchWord: string
  singleProduct: Product
}

export const fetchProducts = createAsyncThunk(
  'product/fetchProducts',
  async (data?: { page: number; limit: number; priceRange: number[] }) => {
    try {
      const response = await axios.get(
        `${baseURL}/api/products?page=${data?.page}&limit=${data?.limit}&minPrice=${data?.priceRange[0]}&maxPrice=${data?.priceRange[1]}`
      )
      const allProducts = response.data
      return allProducts
    } catch (error: any) {
      return new Error(error.response.data)
    }
  }
)

export const fetchSingleProduct = createAsyncThunk(
  'product/fetchSingleProduct',
  async (slug: string) => {
    const response = await axios.get(`${baseURL}/api/products/${slug}`)
    return response.data
  }
)

export const addProduct = createAsyncThunk('product/addProduct', async (product: FormData) => {
  const response = await axios.post(`${baseURL}/api/products`, product, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
  return response.data
})

export const updateProduct = createAsyncThunk(
  'user/updateProduct',
  async (updatedProduct: Partial<Product>) => {
    const response = await axios.put(
      `${baseURL}/api/products/${updatedProduct.slug}`,
      updatedProduct,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    )
    return response.data
  }
)

export const removeProduct = createAsyncThunk('product/removeProduct', async (slug: string) => {
  await axios.delete(`${baseURL}/api/products/${slug}`)
  return slug
})

const initialState: ProductState = {
  products: [],
  error: null,
  isLoading: false,
  searchWord: '',
  singleProduct: {} as Product,
  pagination: {
    totalPages: 1,
    currentPage: 1,
    totalProducts: 0
  }
}

export const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    searchProductByName: (state, action) => {
      state.searchWord = action.payload
    },
    sortProducts: (state, action) => {
      const sortingCriteria = action.payload
      switch (sortingCriteria) {
        case 'nameASC':
          state.products.sort((a, b) => a.name.localeCompare(b.name))
          break
        case 'nameDESC':
          state.products.sort((a, b) => b.name.localeCompare(a.name))
          break
        case 'priceASC':
          state.products.sort((a, b) => Number(a.price) - Number(b.price))
          break
        case 'priceDESC':
          state.products.sort((a, b) => Number(b.price) - Number(a.price))
          break
      }
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchProducts.fulfilled, (state, action) => {
      state.isLoading = false
      state.error = null
      state.products = action.payload.payload.products
      const { totalPages, currentPage, totalProducts } = action.payload.payload.pagination
      state.pagination = {
        currentPage: currentPage,
        totalPages: totalPages,
        totalProducts: totalProducts
      }
    })
    builder.addCase(fetchSingleProduct.fulfilled, (state, action) => {
      state.isLoading = false
      state.error = null
      state.singleProduct = action.payload.payload
    })
    builder.addCase(addProduct.fulfilled, (state, action) => {
      state.isLoading = false
      state.error = null
      state.products = [action.payload.payload, ...state.products]
    })
    builder.addCase(updateProduct.fulfilled, (state, action) => {
      state.isLoading = false
      state.error = null
      state.products = [action.payload.payload, ...state.products]
    })
    builder.addCase(removeProduct.fulfilled, (state, action) => {
      state.isLoading = false
      state.error = null
      state.products = state.products.filter((product) => product.slug !== action.payload)
    })
    builder.addMatcher(
      (action) => action.type.endsWith('/pending'),
      (state) => {
        state.isLoading = true
        state.error = null
      }
    )
    builder.addMatcher(
      (action) => action.type.endsWith('/rejected'),
      (state, action) => {
        state.isLoading = false
        state.error = action.error.message || 'There is an error'
      }
    )
  }
})
export const { sortProducts, searchProductByName } = productSlice.actions

export default productSlice.reducer
