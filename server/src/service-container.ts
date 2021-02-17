import { Db } from 'mongodb'
import { UserRepo, UserRepository } from './user/user-repository'
import { UserServiceInterface, UserService } from './user/user-service'
import { ErrorMesages, errorMessages } from './utils/error-messages'
import Authenticator from './auth/auth'
import HashHelper, { Hash } from './utils/hash'

interface Helper {
  hash: Hash
  auth: Authenticator
}

export interface ServiceContainer {
  userRepository: UserRepo
  userService: UserServiceInterface
  helpers: Helper
  errorMessages: ErrorMesages
}

export function creaeteServiceContainer(db: Db): ServiceContainer {
  const userRepository = new UserRepository(db)
  const hash = new HashHelper()
  const auth = new Authenticator(userRepository)
  const userService = new UserService(userRepository, hash)

  return {
    userRepository: userRepository,
    helpers: {
      hash: hash,
      auth: auth
    },
    userService: userService,
    errorMessages: errorMessages
  }
}
