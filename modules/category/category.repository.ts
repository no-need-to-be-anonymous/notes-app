import { PrismaClient } from '.prisma/client'
import { inject, injectable } from 'inversify'
import { TYPES } from '../../inversify/types'
import { CreateCategory } from './category.types'

export interface ICategoryRepository {
   create(data: CreateCategory): Promise<boolean>
}

@injectable()
export class CategoryRepo implements ICategoryRepository {
   @inject(TYPES.PrismaClient) private readonly prisma: PrismaClient

   async create({ name, user_id }: CreateCategory) {
      const newCategory = await this.prisma.category.create({
         data: {
            name,
            user: {
               connect: { id: user_id },
            },
         },
      })

      return newCategory ? true : false
   }
}
