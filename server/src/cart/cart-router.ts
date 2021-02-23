import CartController from './cart-controller'
import express from 'express'
import { Router } from '../base-classes/interfaces'
import { ServiceContainer } from '../service-container'

export class CartRouter implements Router {
  app: express.Application
  cartController: CartController
  constructor(
    app: express.Application,

    serviceContainer: ServiceContainer
  ) {
    this.app = app
    this.cartController = new CartController(serviceContainer.cart.service)
    this.setRoutes()
  }
  setRoutes() {
    this.app.put(
      '/cart/addItems',
      (req: express.Request, res: express.Response) =>
        this.cartController.addItems(req, res)
    )
    this.app.get('/cart', (req: express.Request, res: express.Response) =>
      this.cartController.getCart(req, res)
    )
  }
}
