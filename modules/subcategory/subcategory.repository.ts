import { PrismaClient } from '@prisma/client'
import { inject, injectable } from 'inversify'
import { TYPES } from '../../inversify/types'
import { CreateSubcategory, CreateSubcategoryResponse } from './subcategory.types'

export interface ISubcategoryRepository {
   create(data: CreateSubcategory): Promise<CreateSubcategoryResponse>
}

@injectable()
export class SubcategoryRepository implements ISubcategoryRepository {
   @inject(TYPES.PrismaClient) private readonly prisma: PrismaClient

   async create({ category_id, name }: CreateSubcategory): Promise<CreateSubcategoryResponse> {
      return await this.prisma.subcategory.create({
         data: {
            name,
            category_id,
         },
         select: {
            id: true,
            name: true
         },
      })
   }
}
