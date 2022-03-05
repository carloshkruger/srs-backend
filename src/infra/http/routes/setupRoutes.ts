import { Application, Router } from 'express'
import { authRoutes } from './auth.routes'
import { cardsRoutes } from './cards.routes'
import { decksRoutes } from './decks.routes'
import { forgotPasswordRoutes } from './forgotPassword.routes'
import { usersRoutes } from './users.routes'

const router = Router()

export const setupRoutes = (app: Application): void => {
  router.use('/v1/', authRoutes)
  router.use('/v1/', cardsRoutes)
  router.use('/v1/', decksRoutes)
  router.use('/v1/', usersRoutes)
  router.use('/v1/', forgotPasswordRoutes)

  app.use(router)
}
