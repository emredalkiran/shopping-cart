import * as Yup from 'yup'

interface SingleFieldValidation {
  fieldName: string
  value: string
  validationSchema: string
}

export const loginValidationSchema = Yup.object().shape({
  email: Yup.string()
    .required('Please enter your email address')
    .email('Please enter a valid email address '),
  password: Yup.string()
    .required('Please enter your password')
    .min(8, 'Your password should be at least 8 characters in length')
})

export const signupValidationSchema = Yup.object().shape({
  name: Yup.string()
    .required('Please enter your email address')
    .min(2, 'Your name should contain at least 2 characters'),
  lastName: Yup.string()
    .required('Please enter your email address')
    .min(2, 'Your last name should contain at least 2 characters'),
  email: Yup.string()
    .required('Please enter your email address')
    .email('Please enter a valid email address '),
  password: Yup.string()
    .required('Please enter your password')
    .min(8, 'Your password should be at least 8 characters in length')
})

export const validateSingleField = ({
  fieldName,
  value,
  validationSchema
}: SingleFieldValidation) => {
  const schema = validationSchema === 'login' ? loginValidationSchema : signupValidationSchema

  try {
    return [false, Yup.reach(schema, fieldName).validateSync(value)]
  } catch (err) {
    return [true, err]
  }
}
