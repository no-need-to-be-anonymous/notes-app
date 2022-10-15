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
   getOneByUserId(name: string, user_id: number): Promise<boolean>
   getOneById(id: number): Promise<boolean>
   getOneByCategoryId(id: number): Promise<CategoryModel>
   update(updateInput: UpdateCategoryInput): Promise<Pick<CategoryModel, 'id' | 'name'>>
   delete(category_id: CategoryModel['id']): Promise<Record<string, unknown>>
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
   async getOneByUserId(name: string, user_id: number): Promise<boolean> {
      const category = await this.prisma.category.findFirst({
         where: {
            user_id,
            name,
         },
      })

      return category ? true : false
   }

   async getOneById(id: number): Promise<boolean> {
      const category = await this.prisma.category.findFirst({
         where: {
            id,
         },
      })

      return category ? true : false
   }

   async getOneByCategoryId(id: number): Promise<CategoryModel> {
      const category = await this.prisma.category.findFirst({
         where: {
            id,
         },
         select: {
            id: true,
            name: true,
            created_at: true,
            updated_at: true,
            user_id: true,
         },
      })
      return category
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
            name: true,
         },
      })
   }

   async delete(category_id: number): Promise<Record<string, unknown>> {
      await this.prisma.category.delete({
         where: {
            id: category_id,
         },
      })
      return {}
   }
}
