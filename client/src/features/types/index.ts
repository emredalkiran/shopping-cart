export interface AuthState {
  isLoggedIn: boolean
  name: string
  authError: string
}

export interface ShopState {
  itemsInCart: number
}

export interface RootState {
  auth: AuthState
  shop: ShopState
}
