import env from 'dotenv'
import http from 'http'
import MongoConnection from './utils/database'
import App from './app'
import { creaeteServiceContainer } from './service-container'
import { Server } from 'socket.io'

async function init() {
  env.config()
  const connectionURL = `mongodb://${process.env.URL}`
  const port = process.env.PORT || 3000
  const databaseConnection = new MongoConnection()
  const app = new App()
  try {
    const db = await databaseConnection.connect(
      connectionURL,
      process.env.DATABASE_NAME!
    )
    console.log(`Connected to ${process.env.DATABASE_NAME} database `)
    console.log('Starting server...')
    const server = http.createServer(app.instance)
    const io = new Server(server, {
      cors: {
        origin: 'http://127.0.0.1:3000',
        methods: ['GET', 'POST'],
        credentials: true
      }
    })
    const serviceContainer = creaeteServiceContainer(db)
    app.configureApp(serviceContainer, io)
    server.listen({ host: '0.0.0.0', port: port }, () =>
      console.log(`Server listening on port ${port}`)
    )
  } catch (err) {
    console.log(err)
  }
}

init()
