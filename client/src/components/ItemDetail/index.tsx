import React, { MouseEvent, TouchEvent, useEffect, useCallback } from 'react'
import { Plus, Minus } from '../Icons'
import {
  updateProductStock,
  addToCart,
  removeFromCart,
  selectShoppingCart,
  fetchProducstInCart,
  updateCart
} from '../../features/product/product-slice'
import { selectLoginStatus } from '../../features/auth/auth-slice'
import { useSelector } from 'react-redux'
import { LoginStatus, RootState } from '../../features/types'
import { useAppDispatch } from '../../store'
interface ItemdetailProps {
  productId: string
  name: string
  stock: number
  price: number
}

function ItemDetail({ productId, name, stock, price }: ItemdetailProps) {
  const dispatch = useAppDispatch()
  const numberOfProductInCart = useSelector(
    (state: RootState) => state.product.shoppingCart[productId] || 0
  )
  const shoppingCart = useSelector(selectShoppingCart)
  const isLoggedIn = useSelector(selectLoginStatus)
  const handleStockChangeClick = async (e: MouseEvent | TouchEvent) => {
    const updateType = e.currentTarget.getAttribute('data-name')!
    if (updateType === 'decrement' && stock === 0) return
    await dispatch(updateProductStock({ updateType: updateType, productId: productId }))
  }

  const handleAddtoCart = async (e: MouseEvent | TouchEvent) => {
    dispatch(addToCart({ productId: productId }))
  }

  const handleRemoveFromCart = async (e: MouseEvent | TouchEvent) => {
    dispatch(removeFromCart({ productId: productId }))
  }
  const updateCustomerCart = useCallback(
    async (shoppingCart: Record<string, number>) => {
      await dispatch(updateCart(shoppingCart))
    },
    [dispatch]
  )

  const checkProductsInCart = useCallback(async () => {
    await dispatch(fetchProducstInCart())
  }, [dispatch])

  useEffect(() => {
    localStorage.setItem('shoppingCart', JSON.stringify(shoppingCart))
    if (isLoggedIn === LoginStatus.LoggedIn) {
      updateCustomerCart(shoppingCart)
    }
  }, [shoppingCart, updateCustomerCart, isLoggedIn])

  return (
    <div>
      <div className="columns">
        <div className="column is-half has-text-weight-semibold is-size-3">{name}</div>
        <div className="column is-half">
          <div className="columns no-select">
            <div className="column is-flex is-size-4 is-align-items-center">€{price}</div>
            <div className="column is-flex is-align-items-center">
              <div
                data-name="decrement"
                onClick={handleStockChangeClick}
                className={` icon-wrapper is-flex is-justify-content-center is-align-items-center ${
                  stock === 0 ? 'disabled' : 'is-clickable'
                }`}
              >
                <Minus fill={stock === 0 ? '#dedede' : ''} />
              </div>
              <div className="is-size-4 pl-3 pr-3 stock-wrapper no-select has-text-centered">
                {stock}
              </div>
              <div
                data-name="increment"
                onClick={handleStockChangeClick}
                className="is-clickable icon-wrapper is-flex is-justify-content-center is-align-items-center"
              >
                <Plus />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="columns">
        <div className="column is-half is-offset-half">
          <div className="mb-4 mt-4">
            <button className="button is-success is-fullwidth" onClick={handleAddtoCart}>
              Add to cart
            </button>
          </div>
          <div className="mb-4 mt-4">
            <button className="button is-warning is-fullwidth" onClick={handleRemoveFromCart}>
              Remove from cart
            </button>
          </div>
          <div className="mb-4 mt-4">Number of this item in the cart: {numberOfProductInCart}</div>
        </div>
      </div>
    </div>
  )
}

export default ItemDetail
