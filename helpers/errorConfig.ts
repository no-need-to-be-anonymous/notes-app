import { ConfigFunction } from 'inversify-express-utils'
import { EXCEPTION_MESSAGE } from './exceptionMessages'
import { HttpException } from './httpException.helper'
import { HttpStatus } from './httpStatus'

export const errorConfig: ConfigFunction = (app) => {
   // eslint-disable-next-line @typescript-eslint/no-unused-vars
   app.use((error, _, res, __) => {
      if (error instanceof HttpException) {
         return res.status(error.status).json({ message: error.message })
      }

      return res
         .status(HttpStatus.INTERNAL_SERVER_ERROR)
         .json({ message: EXCEPTION_MESSAGE.SERVER.INTERNAL_SERVER_ERROR })
   })
}
