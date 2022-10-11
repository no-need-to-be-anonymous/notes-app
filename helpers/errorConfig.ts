import { ConfigFunction } from 'inversify-express-utils'
import { EXCEPTION_MESSAGE } from './exceptionMessages'
import { HttpException } from './httpException.helper'
import { HttpStatus } from './httpStatus'

export const errorConfig: ConfigFunction = (app) => {
   app.use((error, _, res, __) => {
      if (error instanceof HttpException) {
         return res.status(error.status).json({ message: error.message })
      }

      console.log('err', error)
      return res
         .status(HttpStatus.INTERNAL_SERVER_ERROR)
         .json({ message: EXCEPTION_MESSAGE.SERVER.INTERNAL_SERVER_ERROR })
   })
}
