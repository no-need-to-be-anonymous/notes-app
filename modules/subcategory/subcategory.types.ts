import { subcategory } from '@prisma/client'

export type CreateSubcategory = Pick<subcategory, 'category_id' | 'name'>
export type CreateSubcategoryResponse = Pick<subcategory, 'id' | 'name'>
