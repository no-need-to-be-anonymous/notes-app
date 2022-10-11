import { HttpException } from '../../helpers/httpException.helper'
import { HttpStatus } from '../../helpers/httpStatus'
import { inject, injectable } from 'inversify'
import { TYPES } from '../../inversify/types'
import { ICategoryRepository } from './category.repository'
import { Categories, CategoryModel, CreateCategory, CreateCategoryResponse } from './category.types'
import { EXCEPTION_MESSAGE } from '../../helpers/exceptionMessages'

export interface ICategoryService {
   create(category: CreateCategory): Promise<CreateCategoryResponse>
   readAll(user_id: CategoryModel['user_id']): Promise<Categories>
}

@injectable()
export class CategoryService implements ICategoryService {
   @inject(TYPES.ICategoryRepository) private categoryRepo: ICategoryRepository

   async create(category: CreateCategory) {
      const categoryExists = await this.categoryRepo.getOne(category.name, category.user_id)

      if (categoryExists) {
         throw new HttpException(EXCEPTION_MESSAGE.CATEGORY.EXISTS, HttpStatus.CONFLICT)
      }

      return await this.categoryRepo.create(category)
   }

   async readAll(user_id: CategoryModel['user_id']): Promise<Categories> {
      return await this.categoryRepo.readAll(user_id)
   }
}
