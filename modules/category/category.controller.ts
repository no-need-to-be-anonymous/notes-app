import { Request, Response } from 'express'
import { validationResult } from 'express-validator'
import { HttpStatus } from '../../helpers/httpStatus'
import { inject } from 'inversify'
import { BaseHttpController, controller, httpGet, httpPost } from 'inversify-express-utils'
import { TYPES } from '../../inversify/types'
import { ICategoryService } from './category.service'
import { CreateCategory, CreateCategoryResponse } from './category.types'
import { checkCategoryBody, checkCategoryUserIdQuery } from './category.validator'

@controller('')
export class CategoryController extends BaseHttpController {
   @inject(TYPES.ICategoryService) private readonly categoryService: ICategoryService

   @httpPost('/category', ...checkCategoryBody)
   async create(
      req: Request<unknown, unknown, CreateCategory>,
      res: Response
   ): Promise<CreateCategoryResponse> {
      const errors = validationResult(req)

      if (!errors.isEmpty()) {
         res.status(HttpStatus.UNPROCESSABLE_ENTITY).send({ message: 'Invalid request body' })
         return
      }

      const { name, user_id } = req.body
      const data: CreateCategory = {
         name,
         user_id,
      }

      const newCategory = await this.categoryService.create(data)
      res.status(HttpStatus.CREATED).json(newCategory)
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

      res.status(HttpStatus.ACCEPTED).json(categories)
   }
}
