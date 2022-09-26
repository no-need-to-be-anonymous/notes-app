import { PrismaClient } from '@prisma/client'

const prisma: PrismaClient = global.prisma || new PrismaClient()
const isDev = process.env.NODE_ENV === 'development'

// prevents instantiating new PrismaClient on hot reload in development
// assigns prisma to global object
if (isDev) global.prisma = prisma

export default prisma
