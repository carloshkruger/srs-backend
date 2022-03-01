import { AuthenticateUserWithEmailAndPasswordController } from '@api/AuthenticateUserWithEmailAndPasswordController'
import { authTokenProvider } from '@providers/AuthTokenProvider'
import { hashProvider } from '@providers/HashProvider'
import { usersRepository } from '@repositories/index'
import { AuthenticateUserWithEmailAndPasswordUseCase } from '@useCases/AuthenticateUserWithEmailAndPasswordUseCase'
import { celebrate, Segments } from 'celebrate'
import { Router } from 'express'
import Joi from 'joi'

const authRoutes = Router()

const authenticateUserWithEmailAndPasswordUseCase =
  new AuthenticateUserWithEmailAndPasswordUseCase(
    usersRepository,
    hashProvider,
    authTokenProvider
  )
const authenticateUserWithEmailAndPasswordController =
  new AuthenticateUserWithEmailAndPasswordController(
    authenticateUserWithEmailAndPasswordUseCase
  )

authRoutes.post(
  '/auth',
  celebrate({
    [Segments.BODY]: {
      email: Joi.string().email().required(),
      password: Joi.string().required()
    }
  }),
  authenticateUserWithEmailAndPasswordController.execute.bind(
    authenticateUserWithEmailAndPasswordController
  )
)

export { authRoutes }
