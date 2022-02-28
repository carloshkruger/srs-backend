import { connect as connectDatabase } from '@shared/PrismaUtils'
import express from 'express'
import { serve, setup } from 'swagger-ui-express'
import { setupRoutes } from './routes/setupRoutes'
import swaggerConfig from './swagger/swagger.config'

const bootstrap = async () => {
  await connectDatabase()

  const app = express()

  app.use(express.json())
  setupRoutes(app)
  app.use('/api-docs', serve, setup(swaggerConfig))

  app.listen(3000, () => console.log('Server online'))
}

bootstrap()
