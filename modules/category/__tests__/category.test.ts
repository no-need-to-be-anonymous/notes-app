import { TYPES } from '../../../inversify/types'
import { ICategoryService } from '../category.service'
import { ICategoryRepository } from '../category.repository'
import { mockDeep } from 'jest-mock-extended'
import { PrismaClient } from '@prisma/client'
import DIContainer from '../../../inversify/inversify.config'
import '../category.controller'
import { EXCEPTION_MESSAGE } from '../../../helpers/exceptionMessages'

const mockedPrisma = mockDeep<PrismaClient>()
const mockedService = mockDeep<ICategoryService>()

const mockedRepo = mockDeep<ICategoryRepository>()

describe('CategoryService', () => {
   let categoryService: ICategoryService

   beforeEach(() => {
      const container = DIContainer
      container.rebind(TYPES.PrismaClient).toConstantValue(mockedPrisma)
      container.rebind(TYPES.ICategoryRepository).toConstantValue(mockedRepo)

      categoryService = container.get<ICategoryService>(TYPES.ICategoryService)
   })

   it('should return correct object on create', async () => {
      const user_id = 23
      mockedRepo.create.mockResolvedValue({ id: user_id })

      const createdCategory = await categoryService.create({
         name: 'some',
         user_id: user_id,
      })

      expect(createdCategory.id).toEqual(user_id)
   })

   it('should throw an error if category already exists', async () => {
      const user_id = 23
      mockedRepo.getOne.mockResolvedValue(true)

      expect(
         categoryService.create({
            name: 'some',
            user_id: user_id,
         })
      ).rejects.toThrowError(new Error(EXCEPTION_MESSAGE.CATEGORY.EXISTS))
   })

   it('should call 1 time', async () => {
      const user_id = 23
      const categoryRequestBody = { name: 'some', user_id: user_id }
      mockedRepo.create.mockResolvedValue({ id: user_id })

      await mockedService.create(categoryRequestBody)

      expect(mockedService.create).toHaveBeenCalledTimes(1)
   })

   it('should be called with correct arguments', async () => {
      const user_id = 23
      const categoryRequestBody = { name: 'some', user_id: user_id }
      mockedRepo.create.mockResolvedValue({ id: user_id })

      await mockedService.create(categoryRequestBody)

      expect(mockedService.create).toHaveBeenCalledWith(categoryRequestBody)
   })
})
