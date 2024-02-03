import axios from 'axios'

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

const baseURL = import.meta.env.VITE_APP_BASE_URL

export type Category = {
  _id: string
  name: string
  slug: string
}

export type CategoryState = {
  categories: Category[]
  pagination: {
    totalPages: number
    currentPage: number
    totalCategories: number
  }
  error: null | string
  isLoading: boolean
}

export const fetchCategories = createAsyncThunk(
  'category/fetchCategories',
  async (data?: { page: number; limit: number }) => {
    const response = await axios.get(
      `${baseURL}/api/categories?page=${data?.page}&limit=${data?.limit}`
    )
    const allCategories = response.data
    return allCategories
  }
)

export const addCategory = createAsyncThunk('category/addCategory', async (name: string) => {
  const response = await axios.post(`${baseURL}/api/categories`, { name: name })
  return response.data
})

export const updateCategory = createAsyncThunk(
  'category/updateCategory',
  async (category: Partial<Category>) => {
    const response = await axios.put(`${baseURL}/api/categories/${category.slug}`, {
      name: category.name
    })
    return {
      newName: category.name,
      newSlug: response.data.payload.slug,
      oldSlug: category.slug
    }
  }
)

export const removeCategory = createAsyncThunk('category/removeCategory', async (slug: string) => {
  await axios.delete(`${baseURL}/api/categories/${slug}`)
  return slug
})

const initialState: CategoryState = {
  categories: [],
  error: null,
  isLoading: false,
  pagination: {
    totalPages: 1,
    currentPage: 1,
    totalCategories: 0
  }
}

export const categorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchCategories.fulfilled, (state, action) => {
      state.isLoading = false
      state.categories = action.payload.payload.categories
      const { totalPages, currentPage, totalCategories } = action.payload.payload.pagination
      state.pagination = {
        currentPage: currentPage,
        totalPages: totalPages,
        totalCategories: totalCategories
      }
    })
    builder.addCase(addCategory.fulfilled, (state, action) => {
      state.isLoading = false
      state.categories = [action.payload.payload, ...state.categories]
    })
    builder.addCase(updateCategory.fulfilled, (state, action) => {
      state.isLoading = false
      const { newName, newSlug, oldSlug } = action.payload
      const category = state.categories.find((category) => category.slug === oldSlug)
      if (newName && newSlug && category) {
        category.name = newName
        // to update the slug in the categories state
        category.slug = newSlug
      }
    })
    builder.addCase(removeCategory.fulfilled, (state, action) => {
      state.isLoading = false
      state.categories = state.categories.filter((category) => category.slug !== action.payload)
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

export default categorySlice.reducer
