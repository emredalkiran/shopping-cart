import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { AuthState, RootState } from '../types'

const initialState: AuthState = {
  isLoggedIn: false,
  name: '',
  authError: ''
}

export const login = createAsyncThunk('auth/login', async (credentials) => {
  try {
    const response = await axios.post(
      `${process.env.REACT_APP_API_SERVER}/api/v1/user/login`,
      credentials
    )
    return response.data
  } catch (err) {
    if (err.response.status === 401) return err.response.data.response
    else {
      return { success: false, error: 'Oops, something went wrong!' }
    }
  }
})

export const signup = createAsyncThunk('auth/signup', async (credentials) => {
  try {
    const response = await axios.post(
      `${process.env.REACT_APP_API_SERVER}/api/v1/user/signup`,
      credentials
    )
    return response.data
  } catch (err) {
    //TODO: handle async network request error

    if (err.response.status === 400) return err.response.data.response
    else {
      return { success: false, error: 'Please check your credentials' }
    }
  }
})

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loggedIn(sliceState, action) {
      sliceState.isLoggedIn = action.payload.isLoggedIn
      sliceState.name = action.payload.name
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state, action) => {
        state.isLoggedIn = true
        state.name = action.payload.name
      })
      .addCase(signup.pending, (state, action) => {
        state.authError = ''
      })
      .addCase(signup.fulfilled, (state, action) => {
        if (!action.payload.success) {
          state.isLoggedIn = false
          state.name = ''
        } else {
          state.isLoggedIn = true
          state.name = action.payload.name
        }
      })
      .addCase(signup.rejected, (state, action) => {
        state.isLoggedIn = true
      })
  }
})

export const selectUserName = (state: RootState) => state.auth.name
export const selectLoginStatus = (state: RootState) => state.auth.isLoggedIn

export const { loggedIn } = authSlice.actions

const reducer = authSlice.reducer
export default reducer
