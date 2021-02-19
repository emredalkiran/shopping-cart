import { MouseEvent, TouchEvent } from 'react'
import { Plus, Minus } from '../Icons'
import { updateProductStock } from '../../features/product/product-slice'
import { useDispatch } from 'react-redux'
interface ItemdetailProps {
  productId: string
  name: string
  stock: number
  price: number
}

function ItemDetail({ productId, name, stock, price }: ItemdetailProps) {
  const dispatch = useDispatch()
  const handleStockChangeClick = async (e: MouseEvent | TouchEvent) => {
    const updateType = e.currentTarget.getAttribute('data-name')!
    if (updateType === 'decrement' && stock === 0) return
    await dispatch(
      updateProductStock({ updateType: updateType, productId: productId })
    )
  }

  return (
    <div>
      <div className='columns'>
        <div className='column is-half has-text-weight-semibold is-size-3'>
          {name}
        </div>
        <div className='column is-half'>
          <div className='columns no-select'>
            <div className='column is-flex is-size-4 is-align-items-center'>
              €{price}
            </div>
            <div className='column is-flex is-align-items-center'>
              <div
                data-name='decrement'
                onClick={handleStockChangeClick}
                className={` icon-wrapper is-flex is-justify-content-center is-align-items-center ${
                  stock === 0 ? 'disabled' : 'is-clickable'
                }`}
              >
                <Minus fill={stock === 0 ? '#dedede' : ''} />
              </div>
              <div className='is-size-4 pl-3 pr-3 stock-wrapper no-select has-text-centered'>
                {stock}
              </div>
              <div
                data-name='increment'
                onClick={handleStockChangeClick}
                className='is-clickable icon-wrapper is-flex is-justify-content-center is-align-items-center'
              >
                <Plus />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='columns'>
        <div className='column is-half is-offset-half'>
          <div className='mb-4 mt-4'>
            <button className='button is-success is-fullwidth'>
              Add to cart
            </button>
          </div>
          <div className='mb-4 mt-4'>
            <button className='button is-warning is-fullwidth'>
              Remove from cart
            </button>
          </div>
          <div className='mb-4 mt-4'>Number of this item in the cart: 1</div>
        </div>
      </div>
    </div>
  )
}

export default ItemDetail
