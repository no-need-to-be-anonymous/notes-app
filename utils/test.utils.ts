import prisma from '../db/connection'
import { CategoryModel } from '../modules/category/category.types'

export interface User {
   email: string
}

// creates default user for testing purposes so that we can CRUD dependent models
export const createDefaultUsers = async (users: User[]) => {
   await prisma.$connect()
   await prisma.users.createMany({
      data: users,
   })
   await prisma.$disconnect()
}

export const createCategories = async (categories: Pick<CategoryModel, 'name' | 'user_id'>[]) => {
   await prisma.$connect()
   await prisma.category.createMany({
      data: categories,
   })
   await prisma.$disconnect()
}
