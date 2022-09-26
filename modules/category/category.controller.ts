import { Request, Response } from 'express'
import { inject } from 'inversify'
import { BaseHttpController, controller, httpPost } from 'inversify-express-utils'
import { ICategoryService } from './category.service'
import { CreateCategory } from './category.types'

@controller('/category')
export class CategoryController extends BaseHttpController {
   @inject('CategoryService') private readonly categoryService: ICategoryService

   @httpPost('/')
   async create(req: Request<unknown, unknown, CreateCategory>, res: Response): Promise<unknown> {
      const { name, user_id } = req.body
      const data: CreateCategory = {
         name,
         user_id,
      }
      
      await this.categoryService.create(data)
      return ''
   }
}
