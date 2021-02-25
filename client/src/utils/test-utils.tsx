import React, { ReactElement, ReactNode } from 'react'
import { render as rtlRender } from '@testing-library/react'
import { configureStore, Store } from '@reduxjs/toolkit'
import { Provider } from 'react-redux'
import authReducer from '../features/auth/auth-slice'
import productReducer from '../features/product/product-slice'

function render(
  ui: JSX.Element,
  {
    initialState = {},
    store = configureStore({
      reducer: {
        auth: authReducer,
        product: productReducer
      },
      preloadedState: initialState
    }),
    ...renderOptions
  } = {}
) {
  function Wrapper({ children }: { children: JSX.Element }) {
    return <Provider store={store}>{children}</Provider>
  }
  return rtlRender(ui, { wrapper: Wrapper, ...renderOptions })
}

export * from '@testing-library/react'
export { render }
