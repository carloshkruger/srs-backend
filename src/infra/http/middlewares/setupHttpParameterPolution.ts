import { Express } from 'express'
import hpp from 'hpp'

export const setupHttpParameterPolution = (app: Express) => {
  app.use(hpp())
}
