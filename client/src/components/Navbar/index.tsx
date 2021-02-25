import React, { MouseEvent, TouchEvent, useEffect, useCallback, useState } from 'react'
import { useSelector } from 'react-redux'
import { LoginStatus } from '../../features/types'
import {
  selectUserName,
  selectLoginStatus,
  validateLoginStatus,
  logOutUser
} from '../../features/auth/auth-slice'
import {
  selectProductsInCart,
  fetchProducstInCart,
  emptyCart,
  updateCart,
  selectShoppingCart,
  arrangeProducts
} from '../../features/product/product-slice'
import { useAppDispatch } from '../../store'
import { Bag } from '../Icons'

interface NavbarProps {
  handleClick: (e: MouseEvent | TouchEvent) => void
}

export default function Navbar({ handleClick }: NavbarProps) {
  const userName = useSelector(selectUserName)
  const isLoggedin = useSelector(selectLoginStatus)
  const dispatch = useAppDispatch()
  const numberOfProductsinCart = useSelector(selectProductsInCart)
  const shoppingCart = useSelector(selectShoppingCart)
  const [isUserValidated, setUserValidated] = useState<boolean>(false)

  const checkProductsInUserCart = useCallback(async () => {
    await dispatch(fetchProducstInCart())

    dispatch(arrangeProducts())
  }, [dispatch])

  const updateCustomerCart = useCallback(
    async (shoppingCart) => {
      await dispatch(updateCart(shoppingCart))
    },
    [dispatch]
  )

  const validateUserData = useCallback(async () => {
    await dispatch(validateLoginStatus())
  }, [dispatch])

  const handleLogout = async () => {
    await dispatch(logOutUser())
    dispatch(emptyCart())
    localStorage.removeItem('shoppingCart')
    setUserValidated(false)
  }

  useEffect(() => {
    if (isLoggedin === LoginStatus.Pending && !isUserValidated) {
      validateUserData()
    }
  }, [validateUserData, isLoggedin, isUserValidated])

  useEffect(() => {
    if (isLoggedin === LoginStatus.LoggedIn && !isUserValidated) {
      setUserValidated(true)
      if (localStorage.getItem('shoppingCart') === '{}' || !localStorage.getItem('shoppingCart')) {
        checkProductsInUserCart()
      } else {
        updateCustomerCart(shoppingCart)
      }
    }
  }, [
    validateUserData,
    isLoggedin,
    checkProductsInUserCart,
    isUserValidated,
    shoppingCart,
    updateCustomerCart
  ])

  return (
    <nav className="navbar pt-4 pb-4">
      <div className="navbar-brand is-align-items-center">
        <div className="has-text-weight-bold is-size-4">Awesome Shop</div>
        <button
          className="navbar-burger burger"
          aria-label="menu"
          aria-expanded="false"
          data-target="navbarBasicExample"
        >
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </button>
      </div>
      <div className="navbar-menu">
        <div className="navbar-end">
          {isLoggedin !== LoginStatus.Pending && (
            <div className="navbar-item">
              <div className="is-clickable">
                <Bag width="2rem" height="2rem" />
              </div>
              <span className="shopping-cart-item no-select is-clickable">
                {numberOfProductsinCart | 0}
              </span>
            </div>
          )}
          <div className="navbar-item">
            {isLoggedin === LoginStatus.LoggedOut ? (
              <div className="buttons">
                <button className="button is-link" data-name="login" onClick={handleClick}>
                  Login
                </button>
                <button data-name="signup" className="button is-primary" onClick={handleClick}>
                  <strong>Sign up</strong>
                </button>
              </div>
            ) : isLoggedin === LoginStatus.LoggedIn ? (
              <div className="is-flex is-align-items-center">
                <span className="ml-2 has-text-weight-medium">{`Hi, ${userName}`}</span>
                <button className="button is-link is-light" onClick={handleLogout}>
                  <strong>Logout</strong>
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </nav>
  )
}
