import { cartSchema } from './cart-schema'
import {
  ValidationError,
  InvalidCredentialsError,
  DatabaseInsertError
} from '../utils/errors'
import { errorMessages } from '../utils/error-messages'
import { databaseErrors } from '../utils/database-error-codes'
import { CartRepoInterface } from './cart-repository'
import { RequestData } from '../utils/interfaces'
import { Hash } from '../utils/hash'

export interface CartServiceInterface {
  cartRepository: CartRepoInterface
  addItems(request: RequestData): Promise<string>
  getCart(request: RequestData): Promise<string>
}

export class CartService {
  cartRepository: CartRepoInterface
  constructor(cartRepository: CartRepoInterface) {
    this.cartRepository = cartRepository
  }

  async addItems(request: RequestData): Promise<string> {
    console.log(request.body)
    const { error, value } = cartSchema.validate(request.body)
    if (error) {
      console.log('Error: ', error)
      throw new ValidationError(error)
    }
    if (request.session.userId) {
      try {
        const cart = await this.cartRepository.addCart({
          userId: request.session.userId!,
          items: value
        })
        if (!cart) throw new DatabaseInsertError('Cannot save items')

        const response = { success: true }
        return JSON.stringify(response)
      } catch (err) {
        console.log(err)
      }
    }
    throw new InvalidCredentialsError('Invalid credentials')
  }

  async getCart(request: RequestData): Promise<string> {
    if (request.session.userId) {
      const cartData = await this.cartRepository.getCart(request.session.userId)

      if (!cartData) return JSON.stringify({ success: true, shoppingCart: {} })
      const response = {
        success: true,
        items: cartData.items
      }
      return JSON.stringify(response)
    } else throw new InvalidCredentialsError('Invalid credentials')
  }
}
