import { NextFunction, Request, Response } from 'express'
import { ValidationChain, validationResult } from 'express-validator'
import { HttpStatus } from '../helpers/httpStatus'

export const validate = (validations: ValidationChain[]) => {
   return async (req: Request, res: Response, next: NextFunction) => {
      await Promise.all(validations.map((validation) => validation.run(req)))

      const errors = validationResult(req)
      if (errors.isEmpty()) {
         return next()
      }

      const message = errors.formatWith((error) => error.msg).array({ onlyFirstError: true })[0]
      return res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
         message,
      })
   }
}
