import express from 'express'
import { Router } from '../base-classes/interfaces'
import path from 'path'

export class ViewRouter implements Router {
  app: express.Application

  constructor(app: express.Application) {
    this.app = app
    this.setRoutes()
  }
  setRoutes() {
    this.app.get('/', (req: express.Request, res: express.Response) => {
      res.sendFile('index.html')
    })
  }
}
