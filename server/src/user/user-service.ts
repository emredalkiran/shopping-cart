import express from 'express'

import { userAuthenticationSchema, userSchema } from './user-schema'
import {
  ValidationError,
  InvalidCredentialsError,
  DatabaseInsertError
} from '../utils/errors'
import { errorMessages } from '../utils/error-messages'
import { databaseErrors } from '../utils/database-error-codes'
import { UserRepoInterface } from './user-repository'
import { RequestData, User } from '../utils/interfaces'
import { Hash } from '../utils/hash'

interface UserDetails {
  success: boolean
  name: string
  id: string
}

export interface UserServiceInterface {
  userRepository: UserRepoInterface
  login(request: RequestData): Promise<string>
  addUser(request: RequestData): Promise<string>
  logOut(request: RequestData): Promise<string>
  validate(request: RequestData): Promise<string>
}

export class UserService {
  userRepository: UserRepoInterface
  private validator: Hash
  constructor(userRepository: UserRepoInterface, validator: Hash) {
    this.userRepository = userRepository
    this.validator = validator
  }

  async login(request: RequestData): Promise<string> {
    const { error, value } = userAuthenticationSchema.validate(request.body)
    if (error) {
      throw new ValidationError('Valid')
    }
    const user = await this.userRepository.findUserByEmail(value.email)
    if (
      !user ||
      !(await this.validator.validate(value.password, user.hashedPassword))
    ) {
      throw new InvalidCredentialsError('Please check your email and password')
    }
    const response = this.setUserDetails({
      name: user.name,
      id: user._id,
      success: true
    })
    request.session.userId = response.id

    return JSON.stringify(response)
  }

  async addUser(request: RequestData): Promise<string> {
    const { error, value } = userSchema.validate(request.body)
    if (error) {
      throw new ValidationError(error)
    }
    const hashedPassword = await this.validator.hash(value.password)
    const userData = this.setUserData({ ...value, hashedPassword })
    try {
      const queryResult = await this.userRepository.addUser(userData)
      const result = {
        success: true,
        id: queryResult.insertedId,
        name: userData.name
      }
      request.session.userId = result.id
      return JSON.stringify(result)
    } catch (err) {
      if (err.code === databaseErrors.DUPLICATE_KEY) {
        throw new DatabaseInsertError(errorMessages.DUPLICATE_EMAIL)
      } else {
        throw new DatabaseInsertError(errorMessages.UNKNOWN_ERROR)
      }
    }
  }
  async validate(request: RequestData): Promise<string> {
    if (request.session.id && request.session.userId) {
      console.log('User id: ', request.session.userId)
      try {
        const queryResult = await this.userRepository.findUserByID(
          request.session.userId!
        )
        console.log('queryResult : ', queryResult)
        const result = {
          success: true,
          id: queryResult._id,
          name: queryResult.name
        }
        return JSON.stringify(result)
      } catch (err) {
        request.session.destroy((err) => {
          console.log(err)
        })
        throw new ValidationError('Validation error 1')
      }
    } else {
      throw new ValidationError('Validation error 2')
    }
  }

  async logOut(request: RequestData): Promise<string> {
    if (request.session) {
      request.session.destroy((err) => {
        if (err) throw new ValidationError("Can't destroy session")
      })
      const result = {
        succes: true
      }
      return JSON.stringify(result)
    } else {
      throw new ValidationError('No session')
    }
  }

  private setUserData(value: User): User {
    return {
      name: value.name,
      lastName: value.lastName,
      email: value.email,
      hashedPassword: value.hashedPassword
    }
  }

  private setUserDetails(userData: UserDetails): UserDetails {
    return {
      success: userData.success,
      name: userData.name,
      id: userData.id
    }
  }
}
