import { connect as connectDatabase } from '@shared/PrismaUtils'
import express from 'express'
import { setupRoutes } from './routes/setupRoutes'
import { errors } from 'celebrate'
import authentication from './middlewares/authentication'
import { setupRequestLimiter } from './middlewares/setupRequestLimiter'
import { setupSecurityHeaders } from './middlewares/setupSecurityHeaders'
import { setupHttpParameterPolution } from './middlewares/setupHttpParameterPolution'
import { setupCors } from './middlewares/setupCors'
import { setupSwagger } from './middlewares/setupSwagger'

const bootstrap = async () => {
  await connectDatabase()

  const app = express()

  app.use(express.json())
  app.use(authentication)
  setupRequestLimiter(app)
  setupSecurityHeaders(app)
  setupHttpParameterPolution(app)
  setupCors(app)
  setupRoutes(app)
  setupSwagger(app)
  app.use(errors())

  app.listen(3000, () => console.log('Server online'))
}

bootstrap()
