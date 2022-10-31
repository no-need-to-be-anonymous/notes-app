const TYPES = {
   ICategoryRepository: Symbol.for('ICategoryRepository'),
   ICategoryService: Symbol.for('ICategoryService'),
   ICategoryController: Symbol.for('HttpContext'),
   ISubcategoryRepository: Symbol.for('ISubcategoryRepository'),
   ISubcategoryService: Symbol.for('ISubcategoryService'),
   ISubcategoryController: Symbol.for('HttpContext'),
   PrismaClient: Symbol.for('PrismaClient'),
}

export { TYPES }
