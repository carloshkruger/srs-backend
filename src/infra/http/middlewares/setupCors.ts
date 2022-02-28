import { Express } from 'express'
import cors from 'cors'

export const setupCors = (app: Express) => {
  app.use(cors())
}
