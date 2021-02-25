import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { stat } from 'fs'
import { ProductState, RootState } from '../types'

interface StockUpdate {
  updateType: string
  productId: string
}

const initialState: ProductState = {
  products: [],
  shoppingCart: localStorage.getItem('shoppingCart')
    ? JSON.parse(localStorage.getItem('shoppingCart')!)
    : {},
  isProductsLoading: false
}

export const getProducts = createAsyncThunk('product/getProducts', async () => {
  const response = await axios.get('/products')
  return response.data
})

export const updateProductStock = createAsyncThunk(
  'product/updateProductStock',
  async ({ updateType, productId }: StockUpdate) => {
    const response = await axios.put(`/products/${updateType}`, {
      productId: productId
    })
    return response.data
  }
)

export const fetchProducstInCart = createAsyncThunk('product/fetchProducstInCart', async () => {
  const response = await axios.get('/cart', { withCredentials: true })
  return response.data
})

export const updateCart = createAsyncThunk(
  'product/updateCart',
  async (shoppingCart: Record<string, number>) => {
    const response = await axios.put('/cart/addItems', shoppingCart, {
      withCredentials: true
    })
    return response.data
  }
)
const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    changeProductStock(state, action) {
      state.products[action.payload.id].stock = action.payload.stock
    },
    addToCart(state, action) {
      if (state.products.find((el) => el.productId === action.payload.productId)!.stock > 0) {
        if (action.payload.productId in state.shoppingCart) {
          state.shoppingCart[action.payload.productId]++
        } else {
          state.shoppingCart[action.payload.productId] = 1
        }
        state.products.find((el) => el.productId === action.payload.productId)!.stock--
      }
    },
    removeFromCart(state, action) {
      if (state.shoppingCart[action.payload.productId] > 0) {
        state.shoppingCart[action.payload.productId]--
        state.products.find((el) => el.productId === action.payload.productId)!.stock++
        if (state.shoppingCart[action.payload.productId] === 0) {
          delete state.shoppingCart[action.payload.productId]
        }
      }
    },
    arrangeProducts(state) {
      state.products.forEach((product, index) => {
        if (state.shoppingCart[product.productId] && state.shoppingCart[product.productId] > 0) {
          state.products[index].stock -= state.shoppingCart[product.productId]
        }
      })
    },
    emptyCart(state) {
      state.products.forEach((product, index) => {
        if (state.shoppingCart[product.productId]) {
          state.products[index].stock += state.shoppingCart[product.productId]
        }
      })
      state.shoppingCart = {}
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getProducts.pending, (state, action) => {
        state.isProductsLoading = true
      })
      .addCase(getProducts.fulfilled, (state, action) => {
        state.isProductsLoading = false
        state.products = action.payload.products
      })
      .addCase(getProducts.rejected, (state, action) => {
        state.isProductsLoading = false
        state.products = []
      })
      .addCase(updateProductStock.fulfilled, (state, action) => {
        state.products.find((el) => el.productId === action.payload.productId)!.stock =
          action.payload.stock - (state.shoppingCart[action.payload.productId] || 0)
      })
      .addCase(updateProductStock.rejected, (state, action) => {
        // In a production level app, user should be notified that the stock could not be updated via a notification module.
      })
      .addCase(fetchProducstInCart.fulfilled, (state, action) => {
        if (action.payload.items) {
          state.shoppingCart = action.payload.items
        }
      })
  }
})

export const selectProducts = (state: RootState) => state.product.products
export const selectShoppingCart = (state: RootState) => state.product.shoppingCart
export const selectIsProductsLoading = (state: RootState) => state.product.isProductsLoading
export const selectProductsInCart = (state: RootState) => {
  let total = 0
  Object.keys(state.product?.shoppingCart)?.forEach(
    (key) => (total += state.product.shoppingCart[key])
  )
  return total
}

export const { addToCart, removeFromCart, emptyCart, arrangeProducts } = productSlice.actions

const reducer = productSlice.reducer
export default reducer
