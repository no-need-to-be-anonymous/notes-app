export interface CategoryModel {
   id: number
   name: string
   created_at: Date
   updated_at: Date
   user_id: number
}

export type CreateCategory = Pick<CategoryModel, 'name' | 'user_id'>
