import { PrismaClient } from '.prisma/client'
import { inject, injectable } from 'inversify'
import { TYPES } from '../../inversify/types'
import { CreateCategory, CreateCategoryResponse } from './category.types'

export interface ICategoryRepository {
   create(data: CreateCategory): Promise<CreateCategoryResponse>
   getOne(name: string, user_id: number): Promise<boolean>
}

@injectable()
export class CategoryRepo implements ICategoryRepository {
   @inject(TYPES.PrismaClient) private readonly prisma: PrismaClient

   async create({ name, user_id }: CreateCategory): Promise<CreateCategoryResponse> {
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

   async getOne(name: string, user_id: number): Promise<boolean> {
      const category = await this.prisma.category.findFirst({
         where: {
            user_id,
            name,
         },
      })

      return category ? true : false
   }
}
