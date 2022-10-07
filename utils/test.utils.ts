import prisma from '../db/connection'

// creates default user for testing purposes so that we can CRUD dependent models
export const createDefaultUser = async () => {
   await prisma.$connect()
   await prisma.users.create({
      data: {
         email: 'test@mail.com',
      },
   })
   await prisma.$disconnect()
}
