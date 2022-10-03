import { PrismaClient } from '.prisma/client'
import { inject, injectable } from 'inversify'
import { TYPES } from '../../inversify/types'
import { CategoryModel, CreateCategory, CreateCategoryResponse, Categories } from './category.types'

export interface ICategoryRepository {
   create(data: CreateCategory): Promise<CreateCategoryResponse>
   readAll(user_id: CategoryModel['user_id']): Promise<Omit<CategoryModel, 'user_id'>[]>
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

   async readAll(user_id: number): Promise<Categories> {
      return await this.prisma.category.findMany({
         select: {
            name: true,
            created_at: true,
            id: true,
            updated_at: true,
         },
         where: {
            user_id,
         },
      })
   }
}
