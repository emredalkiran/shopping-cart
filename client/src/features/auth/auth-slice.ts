import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { AuthState, RootState, LoginStatus } from '../types'
import Cookies from 'js-cookie'
interface AuthError {
  success: boolean
  error: string
}

const initialState: AuthState = {
  isLoggedIn: Cookies.get('isLoggedIn') ? LoginStatus.Pending : LoginStatus.LoggedOut,
  id: '',
  name: '',
  authError: ''
}

export const login = createAsyncThunk<
  Record<string, any>,
  Record<string, string>,
  { rejectValue: AuthError }
>('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const response = await axios.post('/user/login', credentials, {
      withCredentials: true
    })
    return response.data
  } catch (err) {
    return rejectWithValue(err.response.data.response)
  }
})

export const signup = createAsyncThunk<
  Record<string, any>,
  Record<string, string>,
  { rejectValue: AuthError }
>('auth/signup', async (credentials, { rejectWithValue }) => {
  try {
    const response = await axios.post('/user/signup', credentials, {
      withCredentials: true
    })
    return await response.data
  } catch (err) {
    return rejectWithValue(err.response.data.response)
  }
})

export const validateLoginStatus = createAsyncThunk('auth/validate', async () => {
  const response = await axios.post('/user/validate', {}, { withCredentials: true })
  return response.data
})
export const logOutUser = createAsyncThunk('auth/logout', async () => {
  const response = await axios.post('/user/logout', {}, { withCredentials: true })
  return await response.data
})

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loggedIn(state, action) {
      state.isLoggedIn = action.payload.isLoggedIn
      state.name = action.payload.name
    },
    clearAuthError(state) {
      state.authError = ''
    },
    logOut(state, action) {
      state.isLoggedIn = LoginStatus.LoggedOut
      state.name = ''
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state, action) => {
        state.isLoggedIn = LoginStatus.LoggedOut
        state.authError = ''
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoggedIn = LoginStatus.LoggedIn
        state.id = action.payload.id
        state.name = action.payload.name
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoggedIn = LoginStatus.LoggedOut
        state.authError = action.payload!.error
      })
      .addCase(signup.pending, (state, action) => {
        state.authError = ''
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.isLoggedIn = LoginStatus.LoggedIn
        state.name = action.payload.name
      })
      .addCase(signup.rejected, (state, action) => {
        state.isLoggedIn = LoginStatus.LoggedIn
        state.authError = action.payload?.error || 'Oops, something went wrong'
      })
      .addCase(validateLoginStatus.fulfilled, (state, action) => {
        state.isLoggedIn = LoginStatus.LoggedIn
        state.name = action.payload.name
        state.id = action.payload.id
      })
      .addCase(validateLoginStatus.rejected, (state, action) => {
        state.isLoggedIn = LoginStatus.LoggedOut
      })
      .addCase(logOutUser.fulfilled, (state, action) => {
        state.isLoggedIn = LoginStatus.LoggedOut
        state.name = ''
      })
  }
})

export const selectUserName = (state: RootState) => state.auth.name
export const selectLoginStatus = (state: RootState) => state.auth.isLoggedIn
export const selectAuthError = (state: RootState) => state.auth.authError
export const selectUserId = (state: RootState) => state.auth.id
export const { loggedIn, clearAuthError } = authSlice.actions

const reducer = authSlice.reducer
export default reducer
