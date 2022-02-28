import { Express } from 'express'
import helmet from 'helmet'

export const setupSecurityHeaders = (app: Express) => {
  app.use(helmet())
}
