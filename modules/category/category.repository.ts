import { PrismaClient } from '.prisma/client'
import { inject, injectable } from 'inversify'
import { TYPES } from '../../inversify/types'
import {
   CategoryModel,
   CreateCategory,
   CreateCategoryResponse,
   Categories,
   UpdateCategoryInput,
   UpdateCategoryResponse,
} from './category.types'

export interface ICategoryRepository {
   create(data: CreateCategory): Promise<CreateCategoryResponse>
   readAll(user_id: CategoryModel['user_id']): Promise<Categories>
   getOne(name: string, user_id: number): Promise<boolean>
   update(updateInput: UpdateCategoryInput): Promise<Pick<CategoryModel, 'id'>>
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
         },
         where: {
            user_id,
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

   async update({ id, name }: UpdateCategoryInput): Promise<UpdateCategoryResponse> {
      return await this.prisma.category.update({
         data: {
            name,
         },
         where: {
            id,
         },
         select: {
            id: true,
         },
      })
   }
}
