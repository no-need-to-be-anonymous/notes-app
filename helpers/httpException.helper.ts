import { HttpStatus } from './httpStatus'

export class HttpException extends Error {
   constructor(message: string, public status: HttpStatus) {
      super(message)
   }
}