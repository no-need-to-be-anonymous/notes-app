import { HttpException } from '../../helpers/httpException.helper'
import { HttpStatus } from '../../helpers/httpStatus'
import { inject, injectable } from 'inversify'
import { TYPES } from '../../inversify/types'
import { ICategoryRepository } from './category.repository'
import {
   Categories,
   CategoryModel,
   CreateCategory,
   CreateCategoryResponse,
   UpdateCategoryInput,
   UpdateCategoryResponse,
} from './category.types'
import { EXCEPTION_MESSAGE } from '../../helpers/exceptionMessages'

export interface ICategoryService {
   create(category: CreateCategory): Promise<CreateCategoryResponse>
   readAll(user_id: CategoryModel['user_id']): Promise<Categories>
   update(updateInput: UpdateCategoryInput): Promise<UpdateCategoryResponse>
   delete(category_id: CategoryModel['id']): Promise<unknown>
}

@injectable()
export class CategoryService implements ICategoryService {
   @inject(TYPES.ICategoryRepository) private categoryRepo: ICategoryRepository

   async create(category: CreateCategory) {
      const categoryExists = await this.categoryRepo.getOneByUserId(category.name, category.user_id)

      if (categoryExists) {
         throw new HttpException(EXCEPTION_MESSAGE.CATEGORY.EXISTS, HttpStatus.CONFLICT)
      }

      return await this.categoryRepo.create(category)
   }

   async readAll(user_id: CategoryModel['user_id']): Promise<Categories> {
      return await this.categoryRepo.readAll(user_id)
   }

   async update(updateInput: UpdateCategoryInput): Promise<UpdateCategoryResponse> {
      const categoryExists = await this.categoryRepo.getOneById(updateInput.id)
      if (!categoryExists)
         throw new HttpException(EXCEPTION_MESSAGE.CATEGORY.NOT_EXISTS, HttpStatus.NOT_FOUND)

      return await this.categoryRepo.update(updateInput)
   }

   async delete(category_id: number): Promise<unknown> {
      const categoryExists = await this.categoryRepo.getOneByCategoryId(category_id)

      if (!categoryExists) {
         throw new HttpException(EXCEPTION_MESSAGE.CATEGORY.NOT_EXISTS, HttpStatus.NOT_FOUND)
      }

      return await this.categoryRepo.delete(category_id)
   }
}
