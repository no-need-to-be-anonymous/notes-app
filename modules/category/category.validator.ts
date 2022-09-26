import { checkSchema } from 'express-validator'

export const categoryBody = checkSchema({
   name: {
      isString: true,
      notEmpty: true,
      errorMessage: 'Category name should be provided',
      in: ['body'],
   },
   user_id: {
      isString: true,
      notEmpty: true,
      errorMessage: 'User id should be provided',
      in: ['body'],
   },
})
