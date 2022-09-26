import { Container } from 'inversify'
import { CategoryRepo, ICategoryRepository } from '../modules/category/category.repository'
import { TYPES } from './types'

const DIContainer = new Container()
DIContainer.bind<ICategoryRepository>(TYPES.ICategoryRepository).to(CategoryRepo)

export default DIContainer
