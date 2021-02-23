import express from 'express'
import BaseController from '../base-classes/base-controller'
import { httpHeader, statusCode } from '../utils/http-header'
import { CartServiceInterface } from './cart-service'

export default class CartController extends BaseController {
  cartService: CartServiceInterface
  constructor(cartService: CartServiceInterface) {
    super()
    this.cartService = cartService
  }
  async addItems(req: express.Request, res: express.Response): Promise<void> {
    const reqData = this.getRequestData(req)
    try {
      const response = await this.cartService.addItems(reqData)
      res.set(httpHeader.json).status(statusCode.success).send(response)
    } catch (err) {
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

  async getCart(req: express.Request, res: express.Response): Promise<void> {
    const reqData = this.getRequestData(req)
    try {
      const response = await this.cartService.getCart(reqData)
      res.set(httpHeader.json).status(statusCode.success).send(response)
    } catch (err) {
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
}
