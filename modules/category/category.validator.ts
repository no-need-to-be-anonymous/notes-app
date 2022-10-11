import { body, query } from 'express-validator'
import { EXCEPTION_MESSAGE } from '../../helpers/exceptionMessages'

export const checkCategoryBody = [
   body('name').isString().notEmpty().withMessage('Category name should be provided'),
   body('user_id').isInt().notEmpty().withMessage('User id should be provided'),
]

export const checkCategoryUserIdQuery = [
   query('user_id').notEmpty().withMessage(EXCEPTION_MESSAGE.CATEGORY.MISSING_USER_ID),
]
