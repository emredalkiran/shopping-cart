import { MouseEvent, TouchEvent } from 'react'
import { useSelector } from 'react-redux'
import {
  selectUserName,
  selectLoginStatus
} from '../../features/auth/auth-slice'
import { Bag } from '../Icons'
interface NavbarProps {
  handleClick: (e: MouseEvent | TouchEvent) => void
}

export default function Navbar({ handleClick }: NavbarProps) {
  const userName = useSelector(selectUserName)
  const isLoggedin = useSelector(selectLoginStatus)

  return (
    <nav className='navbar pt-4 pb-4'>
      <div className='navbar-brand is-align-items-center'>
        <div className='has-text-weight-bold is-size-4'>Awesome Shop</div>
        <button
          className='navbar-burger burger'
          aria-label='menu'
          aria-expanded='false'
          data-target='navbarBasicExample'
        >
          <span aria-hidden='true'></span>
          <span aria-hidden='true'></span>
          <span aria-hidden='true'></span>
        </button>
      </div>
      <div className='navbar-menu'>
        <div className='navbar-end'>
          <div className='navbar-item'>
            <div className='is-clickable'>
              <Bag width='2rem' height='2rem' />
            </div>
            <span className='shopping-cart-item no-select is-clickable'>1</span>
          </div>
          <div className='navbar-item'>
            {!isLoggedin ? (
              <div className='buttons'>
                <button
                  className='button is-link'
                  data-name='login'
                  onClick={handleClick}
                >
                  Login
                </button>
                <button
                  data-name='signup'
                  className='button is-primary'
                  onClick={handleClick}
                >
                  <strong>Sign up</strong>
                </button>
              </div>
            ) : (
              <div className='is-flex is-align-items-center'>
                <span className='ml-2 has-text-weight-medium'>
                  {`Hi, ${userName}`}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
