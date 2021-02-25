import React, { ChangeEvent, MouseEvent, TouchEvent, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { login, selectAuthError } from '../../../features/auth/auth-slice'
import { useAppDispatch } from '../../../store'
import { useFormInput } from '../../../hooks'
import FormInput from '../form-input'

export default function LoginForm({
  close,
  changeModal
}: {
  close: () => void
  changeModal: () => void
}) {
  const formFieldNames = ['email', 'password']
  const type = 'login'
  const dispatch = useAppDispatch()
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
    const credentials = await validateForm()
    if (credentials) {
      const result = await dispatch(login(credentials))
      if (result.payload.success) {
        close()
      }
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
              Sign up
            </span>
          </span>
        </p>
      </div>
    </form>
  )
}
