import 'reflect-metadata'
import { InversifyExpressServer } from 'inversify-express-utils'
import DIContainer from './inversify/inversify.config'
import * as bodyParser from 'body-parser'
import './modules/category/category.controller'

const PORT = 8000

const server = new InversifyExpressServer(DIContainer, null, { rootPath: '/api' })

server.setConfig((app) => {
   app.use(bodyParser.json())
})

server.setErrorConfig((app) => {
   app.use((err, req, res, next) => {
      if (err instanceof Error) {
         res.send(err.message)
      }

      res.status(500).send('Something went wrong')
   })
})

const app = server.build()
app.listen(PORT, () => {
   /* eslint-disable-next-line */
   console.log(`Server is running on port ${PORT}`)
})
