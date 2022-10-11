import 'reflect-metadata'
import { InversifyExpressServer } from 'inversify-express-utils'
import DIContainer from '../../../inversify/inversify.config'
import * as bodyParser from 'body-parser'
import request from 'supertest'
import prisma from '../../../db/connection'
import { errorConfig } from '../../../helpers/errorConfig'
import { HttpStatus } from '../../../helpers/httpStatus'
import { EXCEPTION_MESSAGE } from '../../../helpers/exceptionMessages'
import { createDefaultUser } from '../../../utils/test.utils'

describe('/category', () => {
   let app: request.SuperTest<request.Test>

   beforeAll(async () => {
      const server = new InversifyExpressServer(DIContainer)
      server.setConfig((app) => {
         app.use(bodyParser.json())
      })
      server.setErrorConfig(errorConfig)
      app = request(server.build())

      await createDefaultUser()
   })

   describe('POST - create category', () => {
      it('should return correct res.status on create', async () => {
         const createCategoryDTO = { user_id: 1, name: 'Education' }

         const response = await app.post('/category').send(createCategoryDTO)

         expect(response.status).toBe(HttpStatus.CREATED)
      })

      it('should return correct response json', async () => {
         const createCategoryDTO = { user_id: 1, name: 'Education' }

         const response = await app.post('/category').send(createCategoryDTO)

         expect(response.body).toEqual({ id: 1 })
      })

      it('should throw an Error if user_id is missing', async () => {
         const createCategoryDTO = { user_id: 1 }

         const response = await app.post('/category').send(createCategoryDTO)

         expect(response.statusCode).toEqual(HttpStatus.UNPROCESSABLE_ENTITY)
         expect(response.body).toEqual({ message: EXCEPTION_MESSAGE.CATEGORY.INVALID_BODY })
      })

      it('should throw an error with correct message if name is missing', async () => {
         const createCategoryDTO = { name: 'Education' }

         const response = await app.post('/category').send(createCategoryDTO)

         expect(response.statusCode).toEqual(HttpStatus.UNPROCESSABLE_ENTITY)
         expect(response.body).toEqual({ message: EXCEPTION_MESSAGE.CATEGORY.INVALID_BODY })
      })

      it('should throw an error if name already exists', async () => {
         const createCategoryDTO = { name: 'Education', user_id: 1 }

         await app.post('/category').send(createCategoryDTO)
         const response = await app.post('/category').send(createCategoryDTO)

         expect(response.statusCode).toBe(HttpStatus.CONFLICT)
         expect(response.body).toEqual({ message: EXCEPTION_MESSAGE.CATEGORY.EXISTS })
      })

      afterEach(async () => {
         await prisma.$queryRaw`TRUNCATE category RESTART IDENTITY CASCADE;`
      })
   })

   afterAll(async () => {
      await prisma.$queryRaw`TRUNCATE TABLE users RESTART IDENTITY CASCADE;`
      await prisma.$queryRaw`TRUNCATE TABLE category RESTART IDENTITY CASCADE;`
      await prisma.$disconnect()
   })
})
