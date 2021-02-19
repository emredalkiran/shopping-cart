import { MouseEvent, TouchEvent } from 'react'

interface ShoppingItemProps {
  id: string
  index: number
  name: string
  quantity: number
  price: number
  handleClick: (e: MouseEvent | TouchEvent) => void
}

function ShoppingItem({
  id,
  name,
  quantity,
  index,
  handleClick
}: ShoppingItemProps) {
  return (
    <div
      className='card p-4 mt-4 mb-4 is-flex is-justify-content-space-between is-clickable'
      data-id={id}
      data-name='item'
      onClick={handleClick}
    >
      <div>
        <span className='mr-4'>{index}</span>
        <span>{name}</span>
      </div>
      <div>{quantity} in stock</div>
    </div>
  )
}

export default ShoppingItem
