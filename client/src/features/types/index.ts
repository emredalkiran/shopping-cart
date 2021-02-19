interface Product {
  name: string
  productId: string
  price: number
  stock: number
}

export interface AuthState {
  isLoggedIn: boolean
  name: string
  authError: string
}

export interface ProductState {
  products: Array<Product>
  shoppingCart: Array<string>
  isProductsLoading: boolean
}

export interface RootState {
  auth: AuthState
  product: ProductState
}
