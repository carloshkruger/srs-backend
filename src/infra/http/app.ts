import { connect as connectDatabase } from '@shared/PrismaUtils'
import express from 'express'
import { serve, setup } from 'swagger-ui-express'
import { setupRoutes } from './routes/setupRoutes'
import swaggerConfig from './swagger/swagger.config'
import { errors } from 'celebrate'
import authentication from './middlewares/authentication'
import { requestLimiter } from './middlewares/requestLImiter'
import { setupSecurityHeaders } from './middlewares/setupSecurityHeaders'

const bootstrap = async () => {
  await connectDatabase()

  const app = express()

  app.use(express.json())
  app.use(requestLimiter)
  app.use(authentication)
  setupSecurityHeaders(app)
  setupRoutes(app)
  app.use('/api-docs', serve, setup(swaggerConfig))
  app.use(errors())

  app.listen(3000, () => console.log('Server online'))
}

bootstrap()
