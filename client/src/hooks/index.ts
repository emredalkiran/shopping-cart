import { useState } from 'react'
import {
  validateSingleField,
  loginValidationSchema,
  signupValidationSchema
} from '../utils/validation'

interface FormData {
  formFieldNames: Array<string>
  type: string
}

export function useFormInput({ formFieldNames, type }: FormData) {
  const inputData: Record<string, string> = {}
  const touchedData: Record<string, boolean> = {}
  const errorMessageData: Record<string, string> = {}
  const validationSchema = type === 'login' ? loginValidationSchema : signupValidationSchema

  formFieldNames.forEach((key: string) => {
    inputData[key] = ''
    touchedData[key] = false
    errorMessageData[key] = ''
  })

  const [inputs, setInputs] = useState<Record<string, string>>(inputData)
  const [errorMessages, setErrorMessages] = useState<Record<string, string>>(errorMessageData)
  const [touched, setTouched] = useState<Record<string, boolean>>(touchedData)

  const handleInputChange = (fieldName: string, value: string) => {
    if (!touched[fieldName]) {
      setTouched({ ...touched, [fieldName]: true })
    }
    setInputs({ ...inputs, [fieldName]: value })
    const fieldErrorStatus = validateSingleField({
      fieldName,
      value: value,
      validationSchema: type
    })
    if (!fieldErrorStatus[0]) {
      setErrorMessages({ ...errorMessages, [fieldName]: '' })
    } else if (fieldErrorStatus[0]) {
      setErrorMessages({
        ...errorMessages,
        [fieldName]: fieldErrorStatus[1].message
      })
    }
  }
  const handleInputBlur = (fieldName: string) => {
    setTouched({ ...touched, [fieldName]: true })
  }
  const validateForm = async () => {
    const touchAllFields = {}
    formFieldNames.forEach((key: string) => {
      touchAllFields[key] = true
    })
    setTouched(touchAllFields)
    try {
      await validationSchema.validate(inputs, {
        abortEarly: false
      })
      const credentials: Record<string, string> = {}
      formFieldNames.forEach((key) => {
        credentials[key] = inputs[key]
      })
      return credentials
    } catch (err) {
      const errorFields: Array<string> = []
      const errors: Record<string, string> = {}
      console.log(err.inner)
      err.inner.forEach((error: { path: string; message: string }) => {
        if (!errorFields.includes(error.path)) {
          errorFields.push(error.path)
          console.log(errorFields)
          errors[error.path] = error.message
        }
      })
      setErrorMessages({ ...errors })
    }
  }

  return {
    inputs,
    errorMessages,
    touched,
    handleInputChange,
    handleInputBlur,
    validateForm
  }
}
