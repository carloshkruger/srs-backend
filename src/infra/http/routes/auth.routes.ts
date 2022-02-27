import { AuthenticateUserWithEmailAndPasswordController } from '@api/AuthenticateUserWithEmailAndPasswordController'
import { AuthTokenProviderStub } from '@providers/AuthTokenProvider/AuthTokenProviderStub'
import { HashProviderStub } from '@providers/HashProvider/HashProviderStub'
import { UsersRepositoryStub } from '@repositories/stubs/UsersRepositoryStub'
import { AuthenticateUserWithEmailAndPasswordUseCase } from '@useCases/AuthenticateUserWithEmailAndPasswordUseCase'
import { Router } from 'express'

const authRoutes = Router()

const usersRepository = new UsersRepositoryStub()
const hashProvider = new HashProviderStub()
const authTokenProvier = new AuthTokenProviderStub()

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
