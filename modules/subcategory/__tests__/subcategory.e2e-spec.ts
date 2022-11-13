import 'reflect-metadata'
import { InversifyExpressServer } from 'inversify-express-utils'
import request from 'supertest'
import DIContainer from '../../../inversify/inversify.config'
import {
   createCategories,
   createDefaultUsers,
   DefaultCategory,
   User,
} from '../../../utils/test.utils'
import * as bodyParser from 'body-parser'
import { errorConfig } from '../../../helpers/errorConfig'
import { EXCEPTION_MESSAGE } from '../../../helpers/exceptionMessages'
import prisma from '../../../db/connection'
import { HttpStatus } from '../../../helpers/httpStatus'

describe('/subcategory', () => {
   let app: request.SuperTest<request.Test>
   const defaultUsers: User[] = [
      {
         email: 'testing@gmail.com',
      },
      {
         email: 'testing2@gmail.com',
      },
   ]
   const defaultCategories: DefaultCategory[] = [
      {
         name: 'Art',
         user_id: 1,
      },
      {
         name: 'Education',
         user_id: 2,
      },
   ]
   beforeAll(async () => {
      const server = new InversifyExpressServer(DIContainer)
      server.setConfig((app) => {
         app.use(bodyParser.json())
      })
      server.setErrorConfig(errorConfig)
      app = request(server.build())

      await createDefaultUsers(defaultUsers)
      await createCategories(defaultCategories)
   })

   afterEach(async () => {
      await prisma.$queryRaw`TRUNCATE subcategory RESTART IDENTITY CASCADE;`
   })

   it('should throw an error if category_id is missing in request body', async () => {
      const createSubcategoryDTO = { name: 'Mathematics' }
      const errorMessage = { message: EXCEPTION_MESSAGE.SUBCATEGORY.INVALID_BODY }

      const response = await app.post('/subcategory').send(createSubcategoryDTO)

      expect(response.statusCode).toBe(HttpStatus.UNPROCESSABLE_ENTITY)
      expect(response.body).toEqual(errorMessage)
   })

   it('should throw an error if category_id is not of type number', async () => {
      const createSubcategoryDTO = { category_id: { id: 'my id' }, name: 'Art' }
      const errorMessage = { message: EXCEPTION_MESSAGE.SUBCATEGORY.INVALID_BODY_FIELD_TYPE }

      const response = await app.post('/subcategory').send(createSubcategoryDTO)

      expect(response.statusCode).toBe(HttpStatus.UNPROCESSABLE_ENTITY)
      expect(response.body).toEqual(errorMessage)
   })

   it('should throw an error if subcategory name is missing in request body', async () => {
      const createSubcategoryDTO = { category_id: 1 }
      const errorMessage = { message: EXCEPTION_MESSAGE.SUBCATEGORY.INVALID_BODY }

      const response = await app.post('/subcategory').send(createSubcategoryDTO)

      expect(response.statusCode).toBe(HttpStatus.UNPROCESSABLE_ENTITY)
      expect(response.body).toEqual(errorMessage)
   })

   it('should throw an error if subcategory name is of invalid type', async () => {
      const createSubcategoryDTO = { category_id: 1, name: ['Education'] }
      const errorMessage = { message: EXCEPTION_MESSAGE.SUBCATEGORY.INVALID_BODY_FIELD_TYPE }

      const response = await app.post('/subcategory').send(createSubcategoryDTO)

      expect(response.statusCode).toBe(HttpStatus.UNPROCESSABLE_ENTITY)
      expect(response.body).toEqual(errorMessage)
   })

   it('should throw an error if category_id does not exist', async () => {
      const createSubcategoryDTO = {
         category_id: defaultCategories.length + 100,
         name: 'Education',
      }
      const errorMessage = { message: EXCEPTION_MESSAGE.SUBCATEGORY.INVALID_CATEGORY_ID }

      const response = await app.post('/subcategory').send(createSubcategoryDTO)

      expect(response.statusCode).toBe(HttpStatus.UNPROCESSABLE_ENTITY)
      expect(response.body).toEqual(errorMessage)
   })

   it('should return id and name of newly created subcategory', async () => {
      const createSubcategoryDTO = {
         category_id: 2,
         name: 'Math',
      }

      const response = await app.post('/subcategory').send(createSubcategoryDTO)

      expect(response.statusCode).toBe(HttpStatus.CREATED)
      expect(response.body).toEqual({
         id: 1,
         name: createSubcategoryDTO.name,
      })
   })

   afterAll(async () => {
      await prisma.$queryRaw`TRUNCATE TABLE users RESTART IDENTITY CASCADE;`
      await prisma.$disconnect()
   })
})
