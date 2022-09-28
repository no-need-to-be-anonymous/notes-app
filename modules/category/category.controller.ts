import { Request, Response } from 'express'
import { validationResult } from 'express-validator'
import { HttpStatus } from '../../helpers/httpStatus'
import { inject } from 'inversify'
import { BaseHttpController, controller, httpPost } from 'inversify-express-utils'
import { TYPES } from '../../inversify/types'
import { ICategoryService } from './category.service'
import { CreateCategory } from './category.types'
import { checkCategoryBody } from './category.validator'

@controller('/category')
export class CategoryController extends BaseHttpController {
   @inject(TYPES.ICategoryService) private readonly categoryService: ICategoryService

   @httpPost('/', ...checkCategoryBody)
   async create(req: Request<unknown, unknown, CreateCategory>, res: Response): Promise<unknown> {
      const errors = validationResult(req)

      if (!errors.isEmpty()) {
         return res.status(HttpStatus.UNPROCESSABLE_ENTITY).send({ errors: errors.array() })
      }

      const { name, user_id } = req.body
      const data: CreateCategory = {
         name,
         user_id,
      }

      await this.categoryService.create(data)
      return res.send({ created: true })
   }
}
