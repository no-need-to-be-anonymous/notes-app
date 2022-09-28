import 'reflect-metadata'
import * as express from 'express'
import { InversifyExpressServer } from 'inversify-express-utils'
import DIContainer from './inversify/inversify.config'
import './modules/category/category.controller'
import * as bodyParser from 'body-parser'
import { errorConfig } from './helpers/errorConfig'
import swaggerUI from 'swagger-ui-express'
import swaggerSpecs from './docs'

const PORT = 8000

const server = new InversifyExpressServer(DIContainer, null, { rootPath: '/api' })

server.setConfig((app) => {
   app.use(bodyParser.json())
   app.use('/api-docs/swagger', express.static('swagger'))
   app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpecs))
})

server.setErrorConfig(errorConfig)

const app = server.build()
app.listen(PORT, () => {
   /* eslint-disable-next-line */
   console.log(`Server is running on port ${PORT}`)
})
