import { body, param } from 'express-validator'
import { EXCEPTION_MESSAGE } from '../../helpers/exceptionMessages'

export const getCategoriesValidator = [
   param('user_id').isNumeric().withMessage(EXCEPTION_MESSAGE.CATEGORY.INVALID_PARAM_TYPE),
]

export const postCategoryValidator = [
   body('name').isString().withMessage(EXCEPTION_MESSAGE.CATEGORY.INVALID_BODY),
   body('user_id').isInt().withMessage(EXCEPTION_MESSAGE.CATEGORY.INVALID_BODY),
]

export const updateCategoryValidator = [
   param('id').isNumeric().withMessage(EXCEPTION_MESSAGE.CATEGORY.MISSING_ID_PARAM),
   body('name')
      .notEmpty()
      .withMessage(EXCEPTION_MESSAGE.CATEGORY.INVALID_BODY)
      .isString()
      .withMessage(EXCEPTION_MESSAGE.CATEGORY.INVALID_BODY_FIELD_TYPE),
]

export const deleteCategoryValidator = [
   param('id').isNumeric().withMessage(EXCEPTION_MESSAGE.CATEGORY.INVALID_PARAM_TYPE),
]
