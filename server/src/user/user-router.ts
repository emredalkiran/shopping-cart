import UserController from './user-controller'
import express from 'express'
import { Router } from '../base-classes/interfaces'
import { ServiceContainer } from '../service-container'

export class UserRouter implements Router {
  app: express.Application
  userController: UserController
  constructor(
    app: express.Application,

    serviceContainer: ServiceContainer
  ) {
    this.app = app
    this.userController = new UserController(serviceContainer.user.service)
    this.setRoutes()
  }
  setRoutes() {
    this.app.post(
      '/user/login',
      (req: express.Request, res: express.Response) =>
        this.userController.login(req, res)
    )
    this.app.post(
      '/user/signup',
      (req: express.Request, res: express.Response) =>
        this.userController.signup(req, res)
    )
    this.app.post(
      '/user/validate',
      (req: express.Request, res: express.Response) =>
        this.userController.validate(req, res)
    )
    this.app.get('/user/cart', (req: express.Request, res: express.Response) =>
      this.userController.validate(req, res)
    )
    this.app.post(
      '/user/logout',
      (req: express.Request, res: express.Response) =>
        this.userController.logOut(req, res)
    )
  }
}
