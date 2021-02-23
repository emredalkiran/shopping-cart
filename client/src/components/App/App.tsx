import React, { MouseEvent, TouchEvent, useState, useEffect, useCallback } from 'react'
import { useSelector } from 'react-redux'
import { useAppDispatch } from '../../store'
import Navbar from '../Navbar'
import Content from '../Content'
import Modal from '../Modal'
import ShoppingItem from '../ShoppingItem'
import LoginForm from '../Forms/LoginForm'
import SignupForm from '../Forms/SignupForm'
import ItemDetail from '../ItemDetail'
import { getProducts, selectProducts } from '../../features/product/product-slice'
import './main.css'

function App() {
  const [modalType, setModalType] = useState<string>('')
  const [productID, setProductId] = useState<string>()
  const [showCloseButton, setShowCloseButton] = useState<boolean>(false)
  const [isModalOpen, setModalOpenStatus] = useState<boolean>(false)
  const dispatch = useAppDispatch()
  const items = useSelector(selectProducts)
  const handleClick = (e: MouseEvent | TouchEvent) => {
    console.log('Handle Click')
    setModalOpenStatus(true)
    setModalType(e.currentTarget.getAttribute('data-name')!)
    if (e.currentTarget.getAttribute('data-name') === 'item') {
      setShowCloseButton(true)
      setProductId(e.currentTarget.getAttribute('data-id')!)
    }
  }

  const handleClose = () => {
    setModalOpenStatus(false)
    setShowCloseButton(false)
    setModalType('')
  }
  const getProductsData = useCallback(async () => {
    await dispatch(getProducts())
  }, [dispatch])

  useEffect(() => {
    getProductsData()
  }, [getProductsData])

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
          <ItemDetail {...items?.find((el) => el.productId === productID)!} />
        )}
      </Modal>
    </div>
  )
}

export default App
