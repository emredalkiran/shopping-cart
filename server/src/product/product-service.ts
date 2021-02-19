import { productSchema } from './product-schema'
import {
  ValidationError,
  InvalidCredentialsError,
  DatabaseInsertError
} from '../utils/errors'

import { errorMessages } from '../utils/error-messages'
import { databaseErrors } from '../utils/database-error-codes'
import { ProductRepoInterface } from './product-repository'
import { RequestData } from '../utils/interfaces'

export interface ProductServiceInterface {
  productRepository: ProductRepoInterface
  incrementProductStock(request: RequestData): Promise<string>
  decrementProductStock(request: RequestData): Promise<string>
  findAllProducts(): Promise<string>
}

export class ProductService {
  productRepository: ProductRepoInterface
  constructor(productRepository: ProductRepoInterface) {
    this.productRepository = productRepository
  }

  async findAllProducts(): Promise<string> {
    const queryResult = await this.productRepository.findAllProducts()
    const result = {
      success: 'true',
      products: queryResult
    }
    return JSON.stringify(result)
  }

  async incrementProductStock(request: RequestData): Promise<string> {
    const { error, value } = productSchema.validate(request.body)
    if (error) {
      throw new ValidationError(error)
    }
    const updatedValue = await this.productRepository.incrementProductStock(
      value.productId
    )

    const response = {
      success: true,
      stock: updatedValue.value.stock,
      productId: updatedValue.value.productId
    }

    return JSON.stringify(response)
  }

  async decrementProductStock(request: RequestData): Promise<string> {
    const { error, value } = productSchema.validate(request.body)
    if (error) {
      throw new ValidationError(error)
    }
    const updatedValue = await this.productRepository.decrementProductStock(
      value.productId
    )

    const response = {
      success: true,
      stock: updatedValue.value.stock,
      productId: updatedValue.value.productId
    }

    return JSON.stringify(response)
  }
}
