import { Request, Response } from 'express'
import { validationResult } from 'express-validator'
import { HttpStatus } from '../../helpers/httpStatus'
import { inject } from 'inversify'
import { BaseHttpController, controller, httpPost, interfaces } from 'inversify-express-utils'
import { TYPES } from '../../inversify/types'
import { ICategoryService } from './category.service'
import { CreateCategory, CreateCategoryResponse } from './category.types'
import { checkCategoryBody } from './category.validator'
import { HttpException } from '../../helpers/httpException.helper'
import { EXCEPTION_MESSAGE } from '../../helpers/exceptionMessages'

@controller('/category')
export class CategoryController extends BaseHttpController implements interfaces.Controller {
   @inject(TYPES.ICategoryService) private readonly categoryService: ICategoryService

   @httpPost('/', ...checkCategoryBody)
   async create(
      req: Request<unknown, unknown, CreateCategory>,
      res: Response<CreateCategoryResponse>
   ): Promise<Response<CreateCategoryResponse, Record<string, unknown>>> {
      const errors = validationResult(req)

      if (!errors.isEmpty()) {
         throw new HttpException(
            EXCEPTION_MESSAGE.CATEGORY.INVALID_BODY,
            HttpStatus.UNPROCESSABLE_ENTITY
         )
      }

      const { name, user_id } = req.body
      const data: CreateCategory = {
         name,
         user_id,
      }

      const newCategory = await this.categoryService.create(data)
      return res.status(HttpStatus.CREATED).json(newCategory)
   }
}
