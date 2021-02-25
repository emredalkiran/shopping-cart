import React from 'react'
import FormInput from './form-input'
import { render, fireEvent, getByLabelText } from '../../utils/test-utils'

import authReducer, { loggedIn } from '../../features/auth/auth-slice'
import { act } from 'react-dom/test-utils'

describe('FormInput Test', () => {
  let mockHandleBlur: () => void, mockHandleChange: () => void
  beforeAll(() => {
    mockHandleBlur = jest.fn()
    mockHandleChange = jest.fn()
  })
  it('should fire change modal event on click to register', () => {
    const { getByLabelText } = render(
      <FormInput
        label="email"
        type="email"
        fieldName="email"
        errorMessage=""
        touched={false}
        handleBlur={mockHandleBlur}
        handleChange={mockHandleChange}
        inputValue=""
      />
    )
    fireEvent.change(getByLabelText(/email/i), { target: { value: 'test@test.com' } })
    expect(mockHandleChange).toHaveBeenCalledTimes(1)
  })
})
