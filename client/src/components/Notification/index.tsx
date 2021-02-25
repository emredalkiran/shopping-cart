import React from 'react'
function Notificaton({ type, item, name }: { type: string; item: string; name: string }) {
  return (
    <div>
      {name} quantity {type === 'increment' ? 'increased' : 'decreased'} by one in your other
      session
    </div>
  )
}
export default Notificaton
