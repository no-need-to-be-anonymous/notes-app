import { Request, Response } from 'express'
import { inject } from 'inversify'
import { BaseHttpController, controller, httpPost, interfaces } from 'inversify-express-utils'
import { TYPES } from '../../inversify/types'
import { validate } from '../../utils/validate'
import { ISubcategoryService } from './subcategory.service'
import { createSubcategoryValidator } from './subcategory.validator'

@controller('')
export class SubcategoryController extends BaseHttpController implements interfaces.Controller {
   @inject(TYPES.ISubcategoryService) private readonly subcategoryService: ISubcategoryService

   @httpPost('/subcategory', validate(createSubcategoryValidator))
   async createSubcategory(req: Request<unknown>, res: Response) {
      const subcategory = req.body

      const response = await this.subcategoryService.create(subcategory)

      res.json(response)
   }
}
