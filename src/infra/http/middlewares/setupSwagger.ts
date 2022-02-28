import { Express } from 'express'
import { serve, setup } from 'swagger-ui-express'
import swaggerConfig from './../swagger/swagger.config'

export const setupSwagger = (app: Express) => {
  app.use('/api-docs', serve, setup(swaggerConfig))
}
