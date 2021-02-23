interface Product {
  name: string
  productId: string
  price: number
  stock: number
}

export enum LoginStatus {
  Pending,
  LoggedIn,
  LoggedOut
}

export interface AuthState {
  isLoggedIn: LoginStatus
  name: string
  authError: string
}

export interface ProductState {
  products: Array<Product>
  shoppingCart: Record<string, number>
  isProductsLoading: boolean
}

export interface RootState {
  auth: AuthState
  product: ProductState
}
