import { body } from 'express-validator'
import { EXCEPTION_MESSAGE } from '../../helpers/exceptionMessages'

export const createSubcategoryValidator = [
   body('category_id')
      .notEmpty()
      .withMessage(EXCEPTION_MESSAGE.SUBCATEGORY.INVALID_BODY)
      .isInt()
      .withMessage(EXCEPTION_MESSAGE.SUBCATEGORY.INVALID_BODY_FIELD_TYPE),
   body('name')
      .notEmpty()
      .withMessage(EXCEPTION_MESSAGE.SUBCATEGORY.INVALID_BODY)
      .isString()
      .withMessage(EXCEPTION_MESSAGE.SUBCATEGORY.INVALID_BODY_FIELD_TYPE),
]
