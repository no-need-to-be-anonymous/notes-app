import 'reflect-metadata'
import { InversifyExpressServer } from 'inversify-express-utils'
import DIContainer from '../../../inversify/inversify.config'
import * as bodyParser from 'body-parser'
import request from 'supertest'
import prisma from '../../../db/connection'
import { errorConfig } from '../../../helpers/errorConfig'
import { HttpStatus } from '../../../helpers/httpStatus'
import { EXCEPTION_MESSAGE } from '../../../helpers/exceptionMessages'
import { createCategories, createDefaultUsers, User } from '../../../utils/test.utils'
import { CategoryModel } from '../category.types'

describe('/category', () => {
   let app: request.SuperTest<request.Test>

   beforeAll(async () => {
      const defaultUsers: User[] = [
         {
            email: 'test@gmail.com',
         },
         {
            email: 'test2@gmail.com',
         },
      ]

      const server = new InversifyExpressServer(DIContainer)
      server.setConfig((app) => {
         app.use(bodyParser.json())
      })
      server.setErrorConfig(errorConfig)
      app = request(server.build())

      await createDefaultUsers(defaultUsers)
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

   describe('GET - categories for user', () => {
      const defaultDate = '2022-10-11T11:17:33.397Z'
      const categories: Pick<CategoryModel, 'name' | 'user_id' | 'created_at'>[] = [
         {
            name: 'Education',
            user_id: 1,
            created_at: new Date(defaultDate),
         },
         {
            name: 'Art',
            user_id: 1,
            created_at: new Date(defaultDate),
         },
         {
            name: 'Work',
            user_id: 2,
            created_at: new Date(defaultDate),
         },
      ]
      beforeAll(async () => {
         await createCategories(categories)
      })

      it('should throw a validation error if user_id query parameter is missing', async () => {
         const errorMessage = { message: EXCEPTION_MESSAGE.CATEGORY.MISSING_USER_ID }
         const response = await app.get('/categories')

         expect(response.body).toEqual(errorMessage)
      })

      it('should return categories for user', async () => {
         const user_id = 1

         
         const response = await app.get(`/categories?user_id=${user_id}`)
         const userCategories = categories
            .filter((category) => category.user_id === user_id)
            .map(({ name }, index) => {
               const id = index + 1
               return {
                  id,
                  name,
                  created_at: defaultDate,
               }
            })

         expect(response.statusCode).toBe(HttpStatus.OK)
         expect(response.body).toEqual(userCategories)
      })

      it('should return empty array if user does not exists', async () => {
         const user_id = 3

         const response = await app.get(`/categories?user_id=${user_id}`)

         expect(response.statusCode).toBe(HttpStatus.OK)
         expect(response.body).toEqual([])
      })
   })

   afterAll(async () => {
      await prisma.$queryRaw`TRUNCATE TABLE users RESTART IDENTITY CASCADE;`
      await prisma.$queryRaw`TRUNCATE TABLE category RESTART IDENTITY CASCADE;`
      await prisma.$disconnect()
   })
})
