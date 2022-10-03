export interface CategoryModel {
   id: number
   name: string
   created_at: Date
   updated_at: Date
   user_id: number
}

export type Categories = Omit<CategoryModel, 'user_id'>[]

export type CreateCategory = Pick<CategoryModel, 'name' | 'user_id'>
export type CreateCategoryResponse = Pick<CategoryModel,'id'>