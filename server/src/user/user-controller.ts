import express from 'express'
import BaseController from '../base-classes/base-controller'
import { httpHeader, statusCode } from '../utils/http-header'
import { UserServiceInterface } from './user-service'

export default class UserController extends BaseController {
  userService: UserServiceInterface
  constructor(userService: UserServiceInterface) {
    super()
    this.userService = userService
  }
  async login(req: express.Request, res: express.Response): Promise<void> {
    const reqData = this.getRequestData(req)
    try {
      const response = await this.userService.login(reqData)
      res.cookie('isLoggedIn', 'true', { maxAge: 1800000 })
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

  async validate(req: express.Request, res: express.Response): Promise<void> {
    const reqData = this.getRequestData(req)
    try {
      const response = await this.userService.validate(reqData)
      res.set(httpHeader.json).status(statusCode.success).send(response)
    } catch (err) {
      res
        .clearCookie('isLoggedIn')
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

  async signup(req: express.Request, res: express.Response): Promise<void> {
    const reqData = this.getRequestData(req)
    try {
      const response = await this.userService.addUser(reqData)
      res.cookie('isLoggedIn', true, { maxAge: 1800000 })
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

  async logOut(req: express.Request, res: express.Response): Promise<void> {
    const reqData = this.getRequestData(req)
    try {
      const response = await this.userService.logOut(reqData)
      res
        .clearCookie('isLoggedIn')
        .set(httpHeader.json)
        .status(statusCode.success)
        .send(response)
    } catch (err) {
      res
        .set(httpHeader.json)
        .status(statusCode.unauthorized)
        .send({
          response: {
            success: false
          }
        })
    }
  }
}
