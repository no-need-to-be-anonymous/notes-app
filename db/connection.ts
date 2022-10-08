import { PrismaClient } from '@prisma/client'
import dotenv from 'dotenv'
import path from 'path'

const isTest = process.env.NODE_ENV === 'test'

dotenv.config({
   path: path.resolve(__dirname, '../.env.test'),
   override: isTest,
})

const prisma: PrismaClient = global.prisma || new PrismaClient()
const isDev = process.env.NODE_ENV === 'development'

// prevents instantiating new PrismaClient on hot reload in development
// assigns prisma to global object
if (isDev) global.prisma = prisma

export default prisma
