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

      it('should throw an error if user_id is missing', async () => {
         const createCategoryDTO = { name: 'Education' }

         const response = await app.post('/category').send(createCategoryDTO)

         expect(response.statusCode).toEqual(HttpStatus.UNPROCESSABLE_ENTITY)
         expect(response.body).toEqual({ message: EXCEPTION_MESSAGE.CATEGORY.INVALID_BODY })
      })

      it('should throw an error with correct message if name is missing', async () => {
         const createCategoryDTO = { user_id: 1 }

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

      it('should throw a validation error if user_id param is not a number', async () => {
         const errorMessage = { message: EXCEPTION_MESSAGE.CATEGORY.INVALID_PARAM_TYPE }
         const response = await app.get('/categories/some')

         expect(response.statusCode).toBe(HttpStatus.UNPROCESSABLE_ENTITY)
         expect(response.body).toEqual(errorMessage)
      })

      it('should return categories for user', async () => {
         const user_id = 1

         const response = await app.get(`/categories/${user_id}`)
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

         const response = await app.get(`/categories/${user_id}`)

         expect(response.statusCode).toBe(HttpStatus.OK)
         expect(response.body).toEqual([])
      })
   })

   describe('PUT - /category/:id - update category', () => {
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

      afterEach(async () => {
         await prisma.$queryRaw`TRUNCATE category RESTART IDENTITY CASCADE;`
      })

      it('should update category name', async () => {
         const category_id = 1
         const updatedName = 'Psychology'

         const response = await app.put(`/category/${category_id}`).send({
            name: updatedName,
         })

         expect(response.statusCode).toBe(HttpStatus.OK)
         expect(response.body).toEqual({
            id: 1,
            name: updatedName,
         })
      })

      it('should throw an error for not existing category id', async () => {
         const category_id = categories.length + 1
         const updatedName = 'Psychology'
         const errorMessage = { message: EXCEPTION_MESSAGE.CATEGORY.NOT_EXISTS }

         const response = await app.put(`/category/${category_id}`).send({
            name: updatedName,
         })

         expect(response.statusCode).toBe(HttpStatus.NOT_FOUND)
         expect(response.body).toEqual(errorMessage)
      })

      it('should throw an error if name field is missing in request body', async () => {
         const category_id = 1
         const errorMessage = { message: EXCEPTION_MESSAGE.CATEGORY.INVALID_BODY }

         const response = await app.put(`/category/${category_id}`).send({})

         expect(response.statusCode).toBe(HttpStatus.UNPROCESSABLE_ENTITY)
         expect(response.body).toEqual(errorMessage)
      })

      it('should throw an error if name field value is not of correct type', async () => {
         const category_id = 1
         const errorMessage = { message: EXCEPTION_MESSAGE.CATEGORY.INVALID_BODY_FIELD_TYPE }

         const response = await app.put(`/category/${category_id}`).send({ name: 1 })

         expect(response.statusCode).toBe(HttpStatus.UNPROCESSABLE_ENTITY)
         expect(response.body).toEqual(errorMessage)
      })
   })

   describe('DELETE - /category/:id', () => {
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

      it('should throw an error if category id is not a number', async () => {
         const errorMessage = { message: EXCEPTION_MESSAGE.CATEGORY.INVALID_PARAM_TYPE }

         const response = await app.delete(`/category/some`)

         expect(response.body).toEqual(errorMessage)
      })

      it('should throw an error if category id does not exist', async () => {
         const category_id = categories.length + 1
         const errorMessage = { message: EXCEPTION_MESSAGE.CATEGORY.NOT_EXISTS }

         const response = await app.delete(`/category/${category_id}`)

         expect(response.body).toEqual(errorMessage)
      })

      it('should delete category', async () => {
         const category_id = 1
         const user_id = 1

         const response = await app.delete(`/category/${category_id}`)
         const categories = await app.get(`/categories/${user_id}`)

         const deletedCategoryExists = categories.body.find(
            (category) => category.id === category_id
         )

         expect(response.body).toEqual({ id: category_id })
         expect(response.statusCode).toEqual(HttpStatus.OK)
         expect(deletedCategoryExists).toBe(undefined)
      })
   })

   afterAll(async () => {
      await prisma.$queryRaw`TRUNCATE TABLE users RESTART IDENTITY CASCADE;`
      await prisma.$queryRaw`TRUNCATE TABLE category RESTART IDENTITY CASCADE;`
      await prisma.$disconnect()
   })
})
