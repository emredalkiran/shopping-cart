import React from 'react'
import LoginForm from './index'
import { render, fireEvent } from '../../../utils/test-utils'
import { LoginStatus } from '../../../features/types'
import authReducer, { loggedIn } from '../../../features/auth/auth-slice'
import { act } from 'react-dom/test-utils'

describe('LoginForm Test', () => {
  let mockHandleModalChange: () => void, mockHandleClose: () => void
  beforeAll(() => {
    mockHandleModalChange = jest.fn()
    mockHandleClose = jest.fn()
  })
  it('should fire change modal event on click to register', () => {
    const { getByText } = render(
      <LoginForm close={mockHandleClose} changeModal={mockHandleModalChange} />
    )
    fireEvent.click(getByText(/sign up/i))
    expect(mockHandleModalChange).toHaveBeenCalledTimes(1)
  })

  it('should show auth error message when it is set', () => {
    const { getByText } = render(
      <LoginForm close={mockHandleClose} changeModal={mockHandleModalChange} />,
      {
        initialState: {
          auth: {
            isLoggedIn: LoginStatus.LoggedIn,
            name: '',
            id: '',
            authError: 'Please check your email and passwords'
          }
        }
      }
    )
    getByText('Please check your email and passwords')
  })

  it('should fire form submit on button click', async () => {
    const { getByText } = render(
      <LoginForm close={mockHandleClose} changeModal={mockHandleModalChange} />,
      {
        initialState: {
          auth: {
            isLoggedIn: LoginStatus.LoggedOut,
            name: '',
            id: '',
            authError: ''
          }
        }
      }
    )
    fireEvent.click(getByText('Continue'))
    getByText(/Please enter/i)
  })
})
