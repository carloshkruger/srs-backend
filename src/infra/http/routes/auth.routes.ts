import { AuthenticateUserWithEmailAndPasswordController } from '@api/AuthenticateUserWithEmailAndPasswordController'
import { JWTAuthTokenProvider } from '@providers/AuthTokenProvider/JWTAuthTokenProvider'
import { BCryptHashProvider } from '@providers/HashProvider/BCryptHashProvider'
import { PrismaUsersRepository } from '@repositories/prisma/PrismaUsersRepository'
import { AuthenticateUserWithEmailAndPasswordUseCase } from '@useCases/AuthenticateUserWithEmailAndPasswordUseCase'
import { Router } from 'express'

const authRoutes = Router()

const usersRepository = new PrismaUsersRepository()
const hashProvider = new BCryptHashProvider()
const authTokenProvier = new JWTAuthTokenProvider()

const authenticateUserWithEmailAndPasswordUseCase =
  new AuthenticateUserWithEmailAndPasswordUseCase(
    usersRepository,
    hashProvider,
    authTokenProvier
  )
const authenticateUserWithEmailAndPasswordController =
  new AuthenticateUserWithEmailAndPasswordController(
    authenticateUserWithEmailAndPasswordUseCase
  )

authRoutes.post(
  '/auth',
  authenticateUserWithEmailAndPasswordController.execute.bind(
    authenticateUserWithEmailAndPasswordController
  )
)

export { authRoutes }
