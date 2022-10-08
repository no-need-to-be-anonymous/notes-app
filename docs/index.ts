import path from 'path'
import swaggerJSDoc from 'swagger-jsdoc'

export default swaggerJSDoc({
   definition: {
      openapi: '3.0.0',
      info: {
         title: 'Notes app API',
         version: '1.0.0',
         description:
            'This is a simple CRUD API application made with Express and documented with Swagger',
         license: {
            name: 'MIT',
            url: 'https://spdx.org/licenses/MIT.html',
         },
         contact: {
            name: 'Notes app',
         },
      },
      servers: [
         {
            url: 'http://localhost:8000/api',
         },
      ],
      
   },
   apis: [path.resolve('docs/documentation.yml')],
})
