import React, { ChangeEvent } from 'react'

interface FormInput {
  label: string
  type: string
  fieldName: string
  errorMessage: string
  touched: boolean
  handleBlur: () => void
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void
  inputValue: string
}

export default function formInput({
  label,
  type,
  fieldName,
  errorMessage,
  touched,
  handleBlur,
  handleChange,
  inputValue
}: FormInput) {
  return (
    <div className="input-wrapper">
      <label id={fieldName} className="label" htmlFor={fieldName}>
        {label}
      </label>
      <input
        aria-labelledby={fieldName}
        type={type}
        name={fieldName}
        className={`input ${errorMessage !== '' && touched ? 'is-danger' : ''}`}
        onBlur={handleBlur}
        onChange={handleChange}
        value={inputValue}
      />
      {errorMessage !== '' && touched ? <div className="input-error">{errorMessage}</div> : ''}
    </div>
  )
}
