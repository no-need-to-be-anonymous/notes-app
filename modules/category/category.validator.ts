import { NextFunction, Request, Response } from 'express'
import { body, param, query, ValidationChain, validationResult } from 'express-validator'
import { EXCEPTION_MESSAGE } from '../../helpers/exceptionMessages'

export const checkCategoryBody = [
   body('name').isString().notEmpty().withMessage('Category name should be provided'),
   body('user_id').isInt().notEmpty().withMessage('User id should be provided'),
]

export const checkCategoryUserIdQuery = [
   query('user_id').notEmpty().withMessage(EXCEPTION_MESSAGE.CATEGORY.MISSING_USER_ID),
]

export const updateCategoryValidator = [
   param('id').notEmpty().withMessage(EXCEPTION_MESSAGE.CATEGORY.MISSING_ID_PARAM),
   body('name').isString().notEmpty().withMessage(EXCEPTION_MESSAGE.CATEGORY.INVALID_BODY),
]

export const deleteCategoryValidator = [
   param('id').isNumeric().withMessage(EXCEPTION_MESSAGE.CATEGORY.INVALID_PARAM_TYPE),
]

export const validate = (validations: ValidationChain[]) => {
   return async (req: Request, res: Response, next: NextFunction) => {
      await Promise.all(validations.map((validation) => validation.run(req)))

      const errors = validationResult(req)
      if (errors.isEmpty()) {
         return next()
      }

      const message = errors.formatWith((error) => error.msg).array({ onlyFirstError: true })[0]
      return res.status(422).json({
         message,
      })
   }
}
