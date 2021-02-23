import { Db } from 'mongodb'
import { UserRepoInterface, UserRepository } from './user/user-repository'
import { UserServiceInterface, UserService } from './user/user-service'
import { CartRepoInterface, CartRepository } from './cart/cart-repository'
import { CartServiceInterface, CartService } from './cart/cart-service'
import {
  ProductRepoInterface,
  ProductRepository
} from './product/product-repository'
import {
  ProductServiceInterface,
  ProductService
} from './product/product-service'
import { ErrorMesages, errorMessages } from './utils/error-messages'

import HashHelper, { Hash } from './utils/hash'

interface Helper {
  hash: Hash
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

  cart: {
    repository: CartRepoInterface
    service: CartServiceInterface
  }
  helpers: Helper
  errorMessages: ErrorMesages
}

export function creaeteServiceContainer(db: Db): ServiceContainer {
  const userRepository = new UserRepository(db)
  const hash = new HashHelper()
  const userService = new UserService(userRepository, hash)
  const productRepository = new ProductRepository(db)
  const productService = new ProductService(productRepository)
  const cartRepository = new CartRepository(db)
  const cartService = new CartService(cartRepository)

  return {
    user: {
      repository: userRepository,
      service: userService
    },
    product: {
      repository: productRepository,
      service: productService
    },
    cart: {
      repository: cartRepository,
      service: cartService
    },
    helpers: {
      hash: hash
    },
    errorMessages: errorMessages
  }
}
