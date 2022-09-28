import 'reflect-metadata'
import { InversifyExpressServer } from 'inversify-express-utils'
import DIContainer from './inversify/inversify.config'
import './modules/category/category.controller'
import * as bodyParser from 'body-parser'
import { errorConfig } from './helpers/errorConfig'

const PORT = 8000

const server = new InversifyExpressServer(DIContainer, null, { rootPath: '/api' })

server.setConfig((app) => {
   app.use(bodyParser.json())
})

server.setErrorConfig(errorConfig)

const app = server.build()
app.listen(PORT, () => {
   /* eslint-disable-next-line */
   console.log(`Server is running on port ${PORT}`)
})
