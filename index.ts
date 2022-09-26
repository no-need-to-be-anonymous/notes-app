import 'reflect-metadata'
import { InversifyExpressServer } from 'inversify-express-utils'
import DIContainer from './inversify/inversify.config'
import * as bodyParser from 'body-parser'

const PORT = 8000

const server = new InversifyExpressServer(DIContainer)

server.setConfig((app) => {
   app.use(bodyParser.json())
})

const app = server.build()
app.listen(PORT)
