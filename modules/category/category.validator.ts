import { body, query } from 'express-validator'

export const checkCategoryBody = [
   body('name').isString().notEmpty().withMessage('Category name should be provided'),
   body('user_id').isInt().notEmpty().withMessage('User id should be provided'),
]

export const checkCategoryUserIdQuery = [
   query('user_id').notEmpty().withMessage('Invalid user_id query parameter'),
]
