import 'reflect-metadata'
import { Container } from 'inversify'
import { CategoryService, ICategoryService } from '../modules/category/category.service'
import { CategoryRepo, ICategoryRepository } from '../modules/category/category.repository'
import { TYPES } from './types'
import prisma from '../db/connection'
import { PrismaClient } from '@prisma/client'
import { CategoryController } from '../modules/category/category.controller'
import { ISubcategoryService, SubcategoryService } from '../modules/subcategory/subcategory.service'
import {
   ISubcategoryRepository,
   SubcategoryRepository,
} from '../modules/subcategory/subcategory.repository'
import { SubcategoryController } from '../modules/subcategory/subcategory.controller'

const DIContainer = new Container()
// category bindings
DIContainer.bind<ICategoryRepository>(TYPES.ICategoryRepository).to(CategoryRepo)
DIContainer.bind<ICategoryService>(TYPES.ICategoryService).to(CategoryService)
DIContainer.bind(CategoryController).toSelf()

// subcategory bindings
DIContainer.bind<ISubcategoryService>(TYPES.ISubcategoryService).to(SubcategoryService)
DIContainer.bind<ISubcategoryRepository>(TYPES.ISubcategoryRepository).to(SubcategoryRepository)
DIContainer.bind(SubcategoryController).toSelf()

// prisma binding
DIContainer.bind<PrismaClient>(TYPES.PrismaClient).toDynamicValue(() => prisma)

export default DIContainer
