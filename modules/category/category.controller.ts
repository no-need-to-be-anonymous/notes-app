import { Request, Response } from 'express'
import { validationResult } from 'express-validator'
import { HttpStatus } from '../../helpers/httpStatus'
import { inject } from 'inversify'
import {
   BaseHttpController,
   controller,
   httpDelete,
   httpGet,
   httpPost,
   httpPut,
   interfaces,
} from 'inversify-express-utils'
import { TYPES } from '../../inversify/types'
import { ICategoryService } from './category.service'
import { CreateCategory, CreateCategoryResponse, UpdateCategoryInput } from './category.types'
import {
   checkCategoryBody,
   checkCategoryUserIdQuery,
   deleteCategoryValidator,
   updateCategoryValidator,
   validate,
} from './category.validator'
import { HttpException } from '../../helpers/httpException.helper'
import { EXCEPTION_MESSAGE } from '../../helpers/exceptionMessages'

@controller('')
export class CategoryController extends BaseHttpController implements interfaces.Controller {
   @inject(TYPES.ICategoryService) private readonly categoryService: ICategoryService

   @httpPost('/category', ...checkCategoryBody)
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

   @httpGet('/categories', ...checkCategoryUserIdQuery)
   async read(req: Request<unknown, unknown, unknown, { user_id: string }>, res: Response) {
      const userId = req.query.user_id
      const errors = validationResult(req)

      if (!errors.isEmpty()) {
         const message = errors.formatWith((error) => error.msg).array({ onlyFirstError: true })[0]
         return res.json({
            message,
         })
      }

      const categories = await this.categoryService.readAll(Number(userId))

      res.status(HttpStatus.OK).json(categories)
   }

   @httpPut('/category/:id', ...updateCategoryValidator)
   async update(
      req: Request<{ id: number }, unknown, Omit<UpdateCategoryInput, 'id'>>,
      res: Response
   ) {
      const categoryId = req.params.id
      const input: Omit<UpdateCategoryInput, 'id'> = {
         name: req.body.name,
      }
      // TODO move all this logic to middleware
      const errors = validationResult(req)

      if (!errors.isEmpty()) {
         const message = errors.formatWith((error) => error.msg).array({ onlyFirstError: true })[0]
         return res.json({
            message,
         })
      }

      const response = await this.categoryService.update({ id: Number(categoryId), ...input })

      res.status(HttpStatus.OK).json(response)
   }

   @httpDelete('/category/:id', validate(deleteCategoryValidator))
   async delete(req: Request<{ id: number }, unknown>, res: Response) {
      const category_id = req.params.id

      const response = await this.categoryService.delete(Number(category_id))

      res.status(HttpStatus.NO_CONTENT).json(response)
   }
}
