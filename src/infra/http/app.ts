import express from 'express'
import { setupRoutes } from './routes/setupRoutes'
import authentication from './middlewares/authentication'
import { setupRequestLimiter } from './middlewares/setupRequestLimiter'
import { setupSecurityHeaders } from './middlewares/setupSecurityHeaders'
import { setupHttpParameterPolution } from './middlewares/setupHttpParameterPolution'
import { setupCors } from './middlewares/setupCors'
import { setupSwagger } from './middlewares/setupSwagger'
import { errorHandler } from './middlewares/errorHandler'
import { setupSentry } from './middlewares/setupSentry'

const app = express()

app.use(express.json())
app.use(authentication)
setupRequestLimiter(app)
setupSecurityHeaders(app)
setupHttpParameterPolution(app)
setupCors(app)
setupRoutes(app)
setupSwagger(app)
setupSentry(app)
app.use(errorHandler)

export default app
