import { inject, injectable } from 'inversify'
import { TYPES } from '../../inversify/types'
import { ICategoryRepository } from './category.repository'
import { CategoryModel, Categories, CreateCategory, CreateCategoryResponse } from './category.types'

export interface ICategoryService {
   create(category: CreateCategory): Promise<CreateCategoryResponse>
   readAll(user_id: CategoryModel['user_id']): Promise<Categories>
}

@injectable()
export class CategoryService implements ICategoryService {
   @inject(TYPES.ICategoryRepository) private categoryRepo: ICategoryRepository

   async create(category: CreateCategory) {
      return await this.categoryRepo.create(category)
   }

   async readAll(user_id: CategoryModel['user_id']): Promise<Categories> {
      return await this.categoryRepo.readAll(user_id)
   }
}
