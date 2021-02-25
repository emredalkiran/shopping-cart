import express from 'express'
import expressWinston from 'express-winston'
import helmet from 'helmet'
import winston from 'winston'
import bodyParser from 'body-parser'
import session from 'express-session'
import { ServiceContainer } from './service-container'
import { v4 as uuidv4 } from 'uuid'
import redis from 'redis'
import connectRedis from 'connect-redis'
import { UserRouter } from './user/user-router'
import { ProductRouter } from './product/product-router'
import { SessionOptions } from 'express-session'
import { CartRouter } from './cart/cart-router'
import { Server } from 'socket.io'
import path from 'path'
import { ViewRouter } from './view/view-router'

export class App {
  instance: express.Application
  constructor() {
    this.instance = express()
  }

  private setRoutes(serviceContainer: ServiceContainer): void {
    const userRouter = new UserRouter(this.instance, serviceContainer)
    const productRouter = new ProductRouter(this.instance, serviceContainer)
    const cartRouter = new CartRouter(this.instance, serviceContainer)
    const viewRouter = new ViewRouter(this.instance)
  }

  configureApp(serviceContainer: ServiceContainer, io: Server): void {
    const RedisStore = connectRedis(session)
    const redisClient = redis.createClient('redis://redis:6379')
    const sessionStore = new RedisStore({
      client: redisClient,
      ttl: 1800
    })
    const sessionOptions: SessionOptions = {
      genid: () => uuidv4(),
      store: sessionStore,
      secret: process.env.SESSION_SECRET!,
      resave: false,
      cookie: {
        secure: false, //should set to true on production environment
        httpOnly: true,
        maxAge: 1800000,
        sameSite: true
      },
      saveUninitialized: false
    }
    const sessionMiddleware = session(sessionOptions)
    this.instance.use(helmet())
    this.instance.use(bodyParser.urlencoded({ extended: true }))
    this.instance.use(bodyParser.json())
    this.instance.use(sessionMiddleware)
    this.instance.use(
      express.static(path.join(__dirname, '../../client/client-build'))
    )

    io.use((socket, next) => {
      //@ts-ignore
      socket.request.originalUrl = socket.request.url
      //@ts-ignore
      sessionMiddleware(socket.request, {}, next)
    })

    io.on('connection', (socket) => {
      const userId = socket.request.session.userId
        ? socket.request.session.userId
        : null

      if (!userId) socket.disconnect(true)
      else {
        socket.join(userId)
        console.log(userId, 'joined')
        socket.on('addItemToCart', (msg: Record<string, string | number>) => {
          console.log('addItemToCart sent ', msg)
          socket.to(userId).emit('addItemToCart', msg)
        })
        socket.on(
          'removeItemFromCart',
          (msg: Record<string, string | number>) => {
            socket.to(userId).emit('removeItemFromCart', msg)
          }
        )
      }
    })

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
