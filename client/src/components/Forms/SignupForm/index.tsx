import React, { ChangeEvent, MouseEvent, TouchEvent, useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import {
  signup,
  selectLoginStatus,
  selectAuthError,
  clearAuthError
} from '../../../features/auth/auth-slice'
import { useFormInput } from '../../../hooks'
import FormInput from '../form-input'
import { useAppDispatch } from '../../../store'

function SignupForm({ close, changeModal }: { close: () => void; changeModal: () => void }) {
  const formFieldNames = ['name', 'lastName', 'email', 'password']
  const type = 'signup'
  const dispatch = useAppDispatch()
  const isLoggedIn = useSelector(selectLoginStatus)
  const authError = useSelector(selectAuthError)
  const {
    inputs,
    touched,
    errorMessages,
    handleInputChange,
    handleInputBlur,
    validateForm
  } = useFormInput({
    formFieldNames,
    type
  })

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    handleInputChange(e.currentTarget.name, e.currentTarget.value)
  }
  const handleSubmit = async (e: MouseEvent<HTMLButtonElement> | TouchEvent<HTMLButtonElement>) => {
    e.preventDefault()
    const credentials = validateForm()
    if (credentials) {
      const result = await dispatch(signup(credentials))
      if (result.payload.success) close()
    }
  }

  return (
    <form>
      <div className="login-input-elements-wrapper">
        {authError && (
          <div className="message is-danger">
            <div className="message-body">{authError}</div>
          </div>
        )}
        {formFieldNames.map((el) => {
          return (
            <FormInput
              key={el}
              fieldName={el}
              type={el === 'email' || el === 'password' ? el : 'text'}
              label={el}
              errorMessage={errorMessages[el]}
              touched={touched[el]}
              handleBlur={() => handleInputBlur(el)}
              handleChange={(e: ChangeEvent<HTMLInputElement>) => handleChange(e)}
              inputValue={inputs[el]}
            />
          )
        })}
        <button
          type="submit"
          className="button is-primary is-fullwidth has-text-weight-semibold"
          onClick={handleSubmit}
        >
          Continue
        </button>
        <p className="mt-4">
          <span>
            Not registered yet?
            <span
              className="is-clickable is-underlined has-text-weight-semibold ml-2"
              onClick={changeModal}
            >
              Login
            </span>
          </span>
        </p>
      </div>
    </form>
  )
}

export default SignupForm
