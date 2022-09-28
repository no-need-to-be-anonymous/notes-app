import { inject, injectable } from 'inversify'
import { TYPES } from '../../inversify/types'
import { ICategoryRepository } from './category.repository'
import { CreateCategory } from './category.types'

export interface ICategoryService {
   create(category: CreateCategory): Promise<boolean>
}

@injectable()
export class CategoryService implements ICategoryService {
   @inject(TYPES.ICategoryRepository) private categoryRepo: ICategoryRepository

   async create(category: CreateCategory) {
      return await this.categoryRepo.create(category)
   }
}
