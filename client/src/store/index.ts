import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/auth-slice'
import productReducer from '../features/product/product-slice'
const store = configureStore({
  reducer: {
    auth: authReducer,
    product: productReducer
  }
})

export default store
