import { Application, Router } from 'express'
import { authRoutes } from './auth.routes'
import { cardsRoutes } from './cards.routes'
import { decksRoutes } from './decks.routes'
import { forgotPasswordRoutes } from './forgotPassword.routes'
import { usersRoutes } from './users.routes'

const router = Router()

export const setupRoutes = (app: Application): void => {
  router.use(authRoutes)
  router.use(cardsRoutes)
  router.use(decksRoutes)
  router.use(usersRoutes)
  router.use(forgotPasswordRoutes)

  app.use(router)
}
