import ProductController from './produt-controller'
import express from 'express'
import { Router } from '../base-classes/interfaces'
import { ServiceContainer } from '../service-container'

export class ProductRouter implements Router {
  app: express.Application
  productController: ProductController
  constructor(app: express.Application, serviceContainer: ServiceContainer) {
    this.app = app
    this.productController = new ProductController(
      serviceContainer.product.service
    )
    this.setRoutes()
  }
  setRoutes() {
    this.app.get('/products', (req: express.Request, res: express.Response) =>
      this.productController.findAllProducts(req, res)
    )
    this.app.put(
      '/products/increment',
      (req: express.Request, res: express.Response) =>
        this.productController.incrementProductStock(req, res)
    )
    this.app.put(
      '/products/decrement',
      (req: express.Request, res: express.Response) =>
        this.productController.decrementProductStock(req, res)
    )
  }
}
