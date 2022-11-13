export const EXCEPTION_MESSAGE = {
   CATEGORY: {
      INVALID_BODY: 'Invalid request body',
      EXISTS: 'Category already exists',
      MISSING_USER_ID: 'Invalid user_id query parameter',
      MISSING_ID_PARAM: 'Missing id param',
      NOT_EXISTS: 'Category does not exist',
      INVALID_PARAM_TYPE: 'Parameter type is invalid',
      INVALID_BODY_FIELD_TYPE: 'One of fields has incorrect type',
   },
   SUBCATEGORY: {
      INVALID_BODY: 'Invalid request body',
      INVALID_BODY_FIELD_TYPE: 'One of fields has incorrect type',
      INVALID_CATEGORY_ID: 'Cannot create subcategory, category_id does not exist',
   },
   SERVER: {
      INTERNAL_SERVER_ERROR: 'Something went wrong',
   },
}
