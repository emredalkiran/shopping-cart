import { useState, MouseEvent, TouchEvent } from 'react'
import { useSelector } from 'react-redux'
import {
  selectUserName,
  selectLoginStatus
} from '../../../features/auth/authSlice'

export default function NavBar() {
  const [modelOpen, setModalOpen] = useState<boolean>(false)
  const [modalType, setModalType] = useState('')
  const userName = useSelector(selectUserName)
  const isLoggedin = useSelector(selectLoginStatus)
  const close = () => {
    setModalOpen(false)
    setModalType('')
  }
  const handleClick = (
    e:
      | MouseEvent<HTMLButtonElement | HTMLAnchorElement>
      | TouchEvent<HTMLButtonElement | HTMLAnchorElement>
  ) => {
    setModalOpen(true)
    if ((e.target as HTMLButtonElement).id === 'login') {
      setModalType('login')
    } else {
      setModalType('signup')
    }
  }
  return (
    <nav className='navbar'>
      <div className='navbar-brand'>
        <img
          src='/assets/img/quizy-logo.png'
          width='200px'
          height='100px'
          alt='quizy-logo'
        />
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
            {!isLoggedin ? (
              <div className='buttons'>
                <div className='link-button'>
                  <button
                    id='login'
                    onClick={(
                      e:
                        | MouseEvent<HTMLButtonElement>
                        | TouchEvent<HTMLButtonElement>
                    ) => handleClick(e)}
                  >
                    Login
                  </button>
                </div>
                <button
                  id='signup'
                  className='button is-primary'
                  onClick={(
                    e:
                      | MouseEvent<HTMLButtonElement>
                      | TouchEvent<HTMLButtonElement>
                  ) => handleClick(e)}
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
