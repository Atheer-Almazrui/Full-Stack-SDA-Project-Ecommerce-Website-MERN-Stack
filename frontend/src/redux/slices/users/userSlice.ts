import axios from 'axios'

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

axios.defaults.withCredentials = true
const baseURL = import.meta.env.VITE_APP_BASE_URL

export type User = {
  _id: string
  name: string
  email: string
  phone: string
  password: string
  image: string
  address: string
  isAdmin: boolean
  isBanned: boolean
}

export type UserState = {
  users: User[]
  pagination: {
    totalPages: number
    currentPage: number
    totalUsers: number
  }
  error: null | string
  isLoading: boolean
  isLoggedIn: boolean
  userData: User | null
  ban: boolean
}

export const addUser = async (newUser: FormData) => {
  try {
    const response = await axios.post(`${baseURL}/api/users/process-register`, newUser, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return { message: response.data.message, type: 'success' }
  } catch (error: any) {
    if (error.response.status === 409) {
      return { message: error.response.data.message, type: 'error' }
    } else {
      return {
        message: error.response?.data.errors?.[0].msg,
        type: 'error'
      }
    }
  }
}

export const activateUser = async (token: string) => {
  const response = await axios.post(`${baseURL}/api/users/activate`, { token })
  return response.data.message
}

export const grantUserRole = async (email: string, isAdmin: boolean) => {
  const response = await axios.patch(`${baseURL}/api/auth/grant-role`, { email, isAdmin })
  return response.data
}

export const fetchUsers = createAsyncThunk(
  'user/fetchUsers',
  async (data: { page: number; limit: number }) => {
    const response = await axios.get(`${baseURL}/api/users?page=${data.page}&limit=${data.limit}`)
    const allUsers = response.data
    return allUsers
  }
)

export const removeUser = createAsyncThunk('user/removeUser', async (email: string) => {
  await axios.delete(`${baseURL}/api/users/${email}`)
  return email
})

export const banUser = createAsyncThunk('user/banUser', async (email: string) => {
  await axios.put(`${baseURL}/api/users/ban/${email}`)
  return email
})

export const unbanUser = createAsyncThunk('user/unbanUser', async (email: string) => {
  await axios.put(`${baseURL}/api/users/unban/${email}`)
  return email
})

export const forgetPassword = createAsyncThunk('user/forgetPassword', async (email: string) => {
  try {
    const response = await axios.post(`${baseURL}/api/users/forget-password`, { email })
    return response.data
  } catch (error: any) {
    if (error.response.status === 409) {
      return { message: error.response.data.message, type: 'error' }
    } else {
      return {
        message: error.response?.data.errors?.[0].msg,
        type: 'error'
      }
    }
  }
})

export type resetData = {
  password: string
  token: string
}

export const resetPassword = createAsyncThunk(
  'user/resetPassword',
  async (resetData: resetData) => {
    try {
      const response = await axios.put(`${baseURL}/api/users/reset-password`, {
        password: resetData.password,
        token: resetData.token
      })
      return response.data
    } catch (error: any) {
      return {
        message: error.response?.data.errors?.[0].msg,
        type: 'error'
      }
    }
  }
)

export type updatedUserData = {
  name: string
  phone: string
  address: string
  email: string
}

export const updateUser = createAsyncThunk(
  'user/updateUser',
  async (updatedUser: updatedUserData) => {
    await axios.put(`${baseURL}/api/users/${updatedUser.email}`, updatedUser)
    return updatedUser
  }
)

export const login = createAsyncThunk('user/login', async (user: object, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${baseURL}/api/auth/login`, user)
    return response.data
  } catch (error: any) {
    return rejectWithValue(error.response.data)
  }
})

export const logout = createAsyncThunk('user/logout', async () => {
  const response = await axios.post(`${baseURL}/api/auth/logout`)
  return response.data
})

const data =
  localStorage.getItem('loginData') !== null
    ? JSON.parse(String(localStorage.getItem('loginData')))
    : []

const initialState: UserState = {
  users: [],
  pagination: {
    totalPages: 1,
    currentPage: 1,
    totalUsers: 0
  },
  error: null,
  isLoading: false,
  isLoggedIn: data.isLoggedIn,
  userData: data.userData,
  ban: false
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchUsers.fulfilled, (state, action) => {
      state.isLoading = false
      state.users = action.payload.payload.users
      const { totalPages, currentPage, totalUsers } = action.payload.payload.pagination
      state.pagination = {
        currentPage: currentPage,
        totalPages: totalPages,
        totalUsers: totalUsers
      }
    })
    builder.addCase(removeUser.fulfilled, (state, action) => {
      state.isLoading = false
      state.users = state.users.filter((user) => user.email !== action.payload)
    })
    builder.addCase(banUser.fulfilled, (state, action) => {
      state.isLoading = false
      const foundUser = state.users.find((user) => user.email === action.payload)
      if (foundUser) {
        foundUser.isBanned = true
      }
    })
    builder.addCase(unbanUser.fulfilled, (state, action) => {
      state.isLoading = false
      const foundUser = state.users.find((user) => user.email === action.payload)
      if (foundUser) {
        foundUser.isBanned = false
      }
    })
    builder.addCase(updateUser.fulfilled, (state, action) => {
      state.isLoading = false
      const { name, phone, address } = action.payload
      if (state.userData) {
        state.userData.name = name
        state.userData.phone = phone
        state.userData.address = address
        localStorage.setItem(
          'loginData',
          JSON.stringify({
            isLoggedIn: state.isLoggedIn,
            userData: state.userData
          })
        )
      }
    })
    builder.addCase(login.fulfilled, (state, action) => {
      state.isLoading = false
      state.isLoggedIn = true
      state.userData = action.payload.payload
      localStorage.setItem(
        'loginData',
        JSON.stringify({
          isLoggedIn: state.isLoggedIn,
          userData: state.userData
        })
      )
    })
    builder.addCase(logout.fulfilled, (state) => {
      state.isLoading = false
      state.isLoggedIn = false
      state.userData = null
      localStorage.removeItem('cart')
      localStorage.setItem(
        'loginData',
        JSON.stringify({
          isLoggedIn: state.isLoggedIn,
          userData: state.userData
        })
      )
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

export default userSlice.reducer
