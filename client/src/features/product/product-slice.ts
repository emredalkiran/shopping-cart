import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { ProductState, RootState } from '../types'

interface Abcd {
  updateType: string
  productId: string
}

const initialState: ProductState = {
  products: [],
  shoppingCart: [],
  isProductsLoading: false
}

export const getProducts = createAsyncThunk('product/getProducts', async () => {
  console.log('Server: ', process.env.REACT_APP_API_SERVER)
  const response = await axios.get(
    `${process.env.REACT_APP_API_SERVER}/products`
  )
  return response.data
})

export const updateProductStock = createAsyncThunk(
  'product/updateProductStock',
  async ({ updateType, productId }: Abcd) => {
    const response = await axios.put(
      `${process.env.REACT_APP_API_SERVER}/products/${updateType}`,
      {
        productId: productId
      }
    )
    return response.data
  }
)

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    changeProductStock(state, action) {
      state.products[action.payload.id].stock = action.payload.stock
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getProducts.pending, (state, action) => {
        state.isProductsLoading = true
      })
      .addCase(getProducts.fulfilled, (state, action) => {
        console.log('Action payload:', action.payload)
        state.isProductsLoading = false
        state.products = action.payload.products
      })
      .addCase(getProducts.rejected, (state, action) => {
        state.isProductsLoading = false
        state.products = []
      })
      .addCase(updateProductStock.fulfilled, (state, action) => {
        console.log('Fulfilled ', action.payload.productId)
        state.products.find(
          (el) => el.productId === action.payload.productId
        )!.stock = action.payload.stock
      })
      .addCase(updateProductStock.rejected, (state, action) => {
        // In a production level app, user should be notified that the stock could not be updated via a noticication module.
      })
  }
})

export const selectProducts = (state: RootState) => state.product.products

const reducer = productSlice.reducer
export default reducer
