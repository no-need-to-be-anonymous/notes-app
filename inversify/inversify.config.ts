import 'reflect-metadata'
import { Container } from 'inversify'
import { CategoryService, ICategoryService } from '../modules/category/category.service'
import { CategoryRepo, ICategoryRepository } from '../modules/category/category.repository'
import { TYPES } from './types'
import prisma from '../db/connection'
import { PrismaClient } from '@prisma/client'
import { CategoryController } from '../modules/category/category.controller'

const DIContainer = new Container()
DIContainer.bind<ICategoryRepository>(TYPES.ICategoryRepository).to(CategoryRepo)
DIContainer.bind<ICategoryService>(TYPES.ICategoryService).to(CategoryService)
DIContainer.bind<PrismaClient>(TYPES.PrismaClient).toDynamicValue(() => prisma)
DIContainer.bind(CategoryController).toSelf()
export default DIContainer
