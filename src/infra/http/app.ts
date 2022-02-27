import express from 'express'
import { serve, setup } from 'swagger-ui-express'
import { setupRoutes } from './routes/setupRoutes'
import swaggerConfig from './swagger/swagger.config'

const app = express()

app.use(express.json())
setupRoutes(app)
app.use('/api-docs', serve, setup(swaggerConfig))

app.listen(3000)
