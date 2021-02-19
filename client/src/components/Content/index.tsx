import { ReactNode } from 'react'
function Content({ children }: { children: ReactNode }) {
  return (
    <div className='p-6'>
      <h2 className='has-text-centered is-size-2 has-text-weight-bold p-4'>
        Popular Items
      </h2>
      <div className='columns'>
        <div className='column is-half is-offset-one-quarter'>
          <div className='full-width'>{children}</div>
        </div>
      </div>
    </div>
  )
}

export default Content
