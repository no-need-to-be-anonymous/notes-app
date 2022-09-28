import { Prisma } from '@prisma/client'
import { ConfigFunction } from 'inversify-express-utils'
import { HttpStatus } from './httpStatus'

export const errorConfig: ConfigFunction = (app) => {
   app.use((error, req, res, next) => {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
         // "Unique constraint failed on the {constraint}"
         if (error.code === 'P2002') {
            return res
               .status(HttpStatus.BAD_REQUEST)
               .send({ message: 'Cannot create duplicated value' })
         }
      }

      if (error instanceof Error) {
         return res.send(error.message)
      }

      return res.status(500).send('Something went wrong')
   })
}
