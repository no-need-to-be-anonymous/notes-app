import { PrismaClient } from '.prisma/client'
import { injectable } from 'inversify'
import { CreateCategory } from './category.types'

export interface ICategoryRepository {
   create(data: CreateCategory): Promise<boolean>
}

@injectable()
export class CategoryRepo implements ICategoryRepository {
   constructor(private prisma: PrismaClient) {
      this.prisma = prisma
   }

   async create(category: CreateCategory) {
      const newCategory = await this.prisma.category.create({
         data: {
            user_id: 0,
            name: 'fsdf',
         },
      })

      console.log('newCategory prisma', newCategory)
      return true
   }
}
