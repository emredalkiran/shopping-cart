import express from 'express'
import expressWinston from 'express-winston'
import helmet from 'helmet'
import winston from 'winston'
import bodyParser from 'body-parser'
import cors from 'cors'
import session from 'express-session'
import { ServiceContainer } from './service-container'
import { v4 as uuidv4 } from 'uuid'
import redis from 'redis'
import connectRedis from 'connect-redis'
import { UserRouter } from './user/user-router'
import { ProductRouter } from './product/product-router'
import { SessionOptions } from 'express-session'
import { CartRouter } from './cart/cart-router'

export class App {
  instance: express.Application

  constructor() {
    this.instance = express()
  }

  private setRoutes(serviceContainer: ServiceContainer): void {
    const userRouter = new UserRouter(this.instance, serviceContainer)
    const productRouter = new ProductRouter(this.instance, serviceContainer)
    const cartRouter = new CartRouter(this.instance, serviceContainer)
  }

  configureApp(serviceContainer: ServiceContainer): void {
    const RedisStore = connectRedis(session)
    const redisClient = redis.createClient()
    const sessionStore = new RedisStore({ client: redisClient, ttl: 1800 })

    const sessionRoutes = [
      '/user/login',
      '/user/signup',
      '/signup',
      '/product/increment/',
      '/product/decrement/'
    ]
    const sessionOptions: SessionOptions = {
      genid: () => uuidv4(),
      store: sessionStore,
      secret: process.env.SESSION_SECRET!,
      resave: false,
      cookie: {
        secure: false,
        httpOnly: false,
        maxAge: 1800000
      },
      saveUninitialized: false
    }

    this.instance.use(helmet())
    this.instance.use(bodyParser.urlencoded({ extended: true }))
    this.instance.use(bodyParser.json())
    this.instance.use(
      cors<express.Request>({
        origin: [
          'http://127.0.0.1:3000',
          'http://127.0.0.1:3000/',
          'http://127.0.0.1:8080'
        ],
        credentials: true
      })
    )
    this.instance.use(session(sessionOptions))
    this.instance.use(
      expressWinston.logger({
        transports: [new winston.transports.Console()],
        format: winston.format.combine(
          winston.format.colorize(),
          winston.format.json()
        )
      })
    )
    this.setRoutes(serviceContainer)
    this.instance.use(
      expressWinston.errorLogger({
        transports: [new winston.transports.Console()],
        format: winston.format.combine(
          winston.format.colorize(),
          winston.format.json()
        )
      })
    )
  }
}

export default App
