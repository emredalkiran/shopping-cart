import React from 'react'
import { render, fireEvent } from '../../utils/test-utils'
import App from './App'
import reducer, { loggedIn } from '../../features/auth/auth-slice'
import { LoginStatus } from '../../features/types'
import axios from 'axios'
import { act } from 'react-dom/test-utils'
import { screen } from '@testing-library/react'

test('App component renders', () => {
  const { getByText } = render(<App />, {
    initialState: {
      auth: {
        isLoggedIn: false,
        name: '',
        id: ''
      }
    }
  })
  getByText('Popular Items')
})
test('Shows login modal on click to Login', () => {
  const { getByText } = render(<App />, {
    initialState: {
      auth: {
        isLoggedIn: LoginStatus.LoggedOut,
        name: '',
        id: ''
      }
    }
  })
  const aboutButton = getByText('Login')
  fireEvent.click(aboutButton)

  getByText(/Email/i)
  getByText(/Password/i)
  getByText('Continue')
})
