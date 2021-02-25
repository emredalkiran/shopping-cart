import React, { MouseEvent, TouchEvent, useState, useEffect, useCallback, useRef } from 'react'
import { useSelector } from 'react-redux'
import { useAppDispatch } from '../../store'
import Navbar from '../Navbar'
import Content from '../Content'
import Modal from '../Modal'
import Notification from '../Notification'
import ShoppingItem from '../ShoppingItem'
import LoginForm from '../Forms/LoginForm'
import SignupForm from '../Forms/SignupForm'
import ItemDetail from '../ItemDetail'
import {
  arrangeProducts,
  getProducts,
  selectProducts,
  addToCart,
  removeFromCart
} from '../../features/product/product-slice'
import io from 'socket.io-client'
import './main.css'
import { selectLoginStatus, selectUserId } from '../../features/auth/auth-slice'
import { LoginStatus } from '../../features/types'

function App() {
  const [modalType, setModalType] = useState<string>('')
  const [productID, setProductId] = useState<string>()
  const [showCloseButton, setShowCloseButton] = useState<boolean>(false)
  const [isModalOpen, setModalOpenStatus] = useState<boolean>(false)
  const [notificationItem, setNotificationItem] = useState<string>('')
  const [notificationType, setNotificationType] = useState<string>('')
  const socket = useRef(null)
  const isLoggedin = useSelector(selectLoginStatus)
  const userId = useSelector(selectUserId)
  const dispatch = useAppDispatch()
  const items = useSelector(selectProducts)

  const handleClick = (e: MouseEvent | TouchEvent) => {
    setModalOpenStatus(true)
    setModalType(e.currentTarget.getAttribute('data-name')!)
    if (e.currentTarget.getAttribute('data-name') === 'item') {
      setShowCloseButton(true)
      setProductId(e.currentTarget.getAttribute('data-id')!)
    }
  }

  const sendaddItemToCart = (itemData: Record<string, string | number>) => {
    if (!socket.current) return
    socket.current.emit('addItemToCart', itemData)
  }

  const removeItemFromCart = (itemData: Record<string, string | number>) => {
    if (!socket.current) return
    socket.current.emit('removeItemFromCart', itemData)
  }

  const handleClose = () => {
    setModalOpenStatus(false)
    setShowCloseButton(false)
    setModalType('')
  }

  const arrangeItems = useCallback(() => {
    dispatch(arrangeProducts())
  }, [dispatch])

  const getProductsData = useCallback(async () => {
    await dispatch(getProducts())
    arrangeItems()
  }, [dispatch, arrangeItems])

  const handleNotification = useCallback((productId: string, type: string) => {
    setModalType('notification')
    setNotificationItem(productId)
    setNotificationType(type)
    setModalOpenStatus(true)
    setShowCloseButton(true)
  }, [])

  useEffect(() => {
    getProductsData()
  }, [getProductsData])

  useEffect(() => {
    if (isLoggedin === LoginStatus.LoggedIn && !socket.current && userId) {
      socket.current = io(process.env.API_SERVER, {
        withCredentials: true
      })

      socket.current.on('addItemToCart', (data: Record<string, string>) => {
        dispatch(addToCart({ productId: data.id }))
        handleNotification(data.id, 'increment')
      })
      socket.current.on('removeItemFromCart', (data: Record<string, string>) => {
        dispatch(removeFromCart({ productId: data.id }))
        handleNotification(data.id, 'decrement')
      })
    }

    return () => {
      if (socket.current) {
        socket.current.disconnect()
        socket.current = null
      }
    }
  }, [isLoggedin, userId, handleNotification, dispatch])

  return (
    <div className="main">
      <Navbar handleClick={handleClick} />
      <Content>
        {items?.map(({ productId, name, stock, price }, index) => {
          return (
            <ShoppingItem
              key={`${index}-${name}`}
              id={productId}
              index={index + 1}
              name={name}
              quantity={stock}
              price={price}
              handleClick={handleClick}
            />
          )
        })}
      </Content>
      <Modal
        open={isModalOpen}
        close={handleClose}
        withCloseButton={showCloseButton}
        title={modalType}
      >
        {modalType === 'login' && (
          <LoginForm close={handleClose} changeModal={() => setModalType('signup')} />
        )}
        {modalType === 'signup' && (
          <SignupForm close={handleClose} changeModal={() => setModalType('login')} />
        )}
        {modalType === 'item' && (
          <ItemDetail
            {...items?.find((el) => el.productId === productID)!}
            sendaddItemToCart={sendaddItemToCart}
            removeItemFromCart={removeItemFromCart}
          />
        )}
        {modalType === 'notification' && notificationItem && notificationType && (
          <Notification
            type={notificationType}
            item={notificationItem}
            name={items?.find((el) => el.productId === notificationItem)!.name}
          />
        )}
      </Modal>
    </div>
  )
}

export default App
