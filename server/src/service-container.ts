import { Db } from 'mongodb'
import { UserRepoInterface, UserRepository } from './user/user-repository'
import { UserServiceInterface, UserService } from './user/user-service'
import {
  ProductRepoInterface,
  ProductRepository
} from './product/product-repository'
import {
  ProductServiceInterface,
  ProductService
} from './product/product-service'
import { ErrorMesages, errorMessages } from './utils/error-messages'
import Authenticator from './auth/auth'
import HashHelper, { Hash } from './utils/hash'

interface Helper {
  hash: Hash
  auth: Authenticator
}

export interface ServiceContainer {
  user: {
    repository: UserRepoInterface
    service: UserServiceInterface
  }
  product: {
    repository: ProductRepoInterface
    service: ProductServiceInterface
  }
  helpers: Helper
  errorMessages: ErrorMesages
}

export function creaeteServiceContainer(db: Db): ServiceContainer {
  const userRepository = new UserRepository(db)
  const hash = new HashHelper()
  const auth = new Authenticator(userRepository)
  const userService = new UserService(userRepository, hash)
  const productRepository = new ProductRepository(db)
  const productService = new ProductService(productRepository)
  return {
    user: {
      repository: userRepository,
      service: userService
    },
    product: {
      repository: productRepository,
      service: productService
    },
    helpers: {
      hash: hash,
      auth: auth
    },
    errorMessages: errorMessages
  }
}
