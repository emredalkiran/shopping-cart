import express from 'express'
import { silly } from 'winston'
import BaseController from '../base-classes/base-controller'
import { httpHeader, statusCode } from '../utils/http-header'
import { ProductServiceInterface } from './product-service'

export default class UserController extends BaseController {
  productService: ProductServiceInterface
  constructor(productService: ProductServiceInterface) {
    super()
    this.productService = productService
  }
  async findAllProducts(
    req: express.Request,
    res: express.Response
  ): Promise<void> {
    console.log('In controller')
    try {
      const response = await this.productService.findAllProducts()
      console.log('Response: ', response)
      res.set(httpHeader.json).status(statusCode.success).send(response)
    } catch (err) {
      console.log(err)
      res
        .set(httpHeader.json)
        .status(statusCode.unauthorized)
        .send({
          response: {
            success: false,
            error: err.errorMessage
          }
        })
    }
  }

  async incrementProductStock(
    req: express.Request,
    res: express.Response
  ): Promise<void> {
    const reqData = this.getRequestData(req)
    try {
      const response = await this.productService.incrementProductStock(reqData)
      console.log('Response: ', response)
      res.set(httpHeader.json).status(statusCode.success).send(response)
    } catch (err) {
      res
        .set(httpHeader.json)
        .status(statusCode.badRequest)
        .send({
          response: {
            success: false,
            error: err.errorMessage
          }
        })
    }
  }
  async decrementProductStock(
    req: express.Request,
    res: express.Response
  ): Promise<void> {
    const reqData = this.getRequestData(req)
    try {
      const response = await this.productService.decrementProductStock(reqData)
      res.set(httpHeader.json).status(statusCode.success).send(response)
    } catch (err) {
      res
        .set(httpHeader.json)
        .status(statusCode.badRequest)
        .send({
          response: {
            success: false,
            error: err.errorMessage
          }
        })
    }
  }
}
