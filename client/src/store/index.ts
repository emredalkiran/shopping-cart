import { configureStore } from '@reduxjs/toolkit'
import { useDispatch } from 'react-redux'
import authReducer from '../features/auth/auth-slice'
import productReducer from '../features/product/product-slice'
const store = configureStore({
  reducer: {
    auth: authReducer,
    product: productReducer
  }
})

export default store

export type AppDispatch = typeof store.dispatch
export const useAppDispatch = () => useDispatch<AppDispatch>()
