import { inject, injectable } from 'inversify'
import { EXCEPTION_MESSAGE } from '../../helpers/exceptionMessages'
import { HttpException } from '../../helpers/httpException.helper'
import { HttpStatus } from '../../helpers/httpStatus'
import { TYPES } from '../../inversify/types'
import { ICategoryRepository } from '../category/category.repository'
import { ISubcategoryRepository } from './subcategory.repository'
import { CreateSubcategory, CreateSubcategoryResponse } from './subcategory.types'

export interface ISubcategoryService {
   create(data: CreateSubcategory): Promise<CreateSubcategoryResponse>
}

@injectable()
export class SubcategoryService implements ISubcategoryService {
   @inject(TYPES.ISubcategoryRepository) private subcategoryRepo: ISubcategoryRepository
   @inject(TYPES.ICategoryRepository) private categoryRepo: ICategoryRepository

   async create(data: CreateSubcategory): Promise<CreateSubcategoryResponse> {
      const categoryExists = await this.categoryRepo.getOneById(data.category_id)

      if (!categoryExists) {
         throw new HttpException(
            EXCEPTION_MESSAGE.SUBCATEGORY.INVALID_CATEGORY_ID,
            HttpStatus.UNPROCESSABLE_ENTITY
         )
      }
      
      return this.subcategoryRepo.create(data)
   }
}
