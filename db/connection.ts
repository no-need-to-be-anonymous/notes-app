import { PrismaClient } from '@prisma/client'

const prisma: PrismaClient = global.prisma || new PrismaClient()
const isDev = process.env.NODE_ENV === 'development'

if (isDev) global.prisma = prisma

export default prisma
