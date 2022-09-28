import { PrismaClient } from '.prisma/client'
import { inject, injectable } from 'inversify'
import { TYPES } from '../../inversify/types'
import { CreateCategory, CreateCategoryResponse } from './category.types'

export interface ICategoryRepository {
   create(data: CreateCategory): Promise<CreateCategoryResponse>
}

@injectable()
export class CategoryRepo implements ICategoryRepository {
   @inject(TYPES.PrismaClient) private readonly prisma: PrismaClient

   async create({ name, user_id }: CreateCategory) {
      return await this.prisma.category.create({
         data: {
            name,
            user: {
               connect: { id: user_id },
            },
         },
         select: {
            id: true,
         },
      })
   }
}
