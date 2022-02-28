import { ResetPasswordController } from '@api/ResetPasswordController'
import { SendForgotPasswordEmailController } from '@api/SendForgotPasswordEmailController'
import { BCryptHashProvider } from '@providers/HashProvider/BCryptHashProvider'
import { MailProviderStub } from '@providers/MailProvider/MailProviderStub'
import { PrismaUsersRepository } from '@repositories/prisma/PrismaUsersRepository'
import { PrismaUserTokensRepository } from '@repositories/prisma/PrismaUserTokensRepository'
import { ResetPasswordUseCase } from '@useCases/ResetPasswordUseCase'
import { SendForgotPasswordEmailUseCase } from '@useCases/SendForgotPasswordEmailUseCase'
import { Router } from 'express'

const forgotPasswordRoutes = Router()

const usersRepository = new PrismaUsersRepository()
const userTokensRepository = new PrismaUserTokensRepository()
const hashProvider = new BCryptHashProvider()
const mailProvider = new MailProviderStub()

const sendForgotPasswordEmailUseCase = new SendForgotPasswordEmailUseCase(
  usersRepository,
  userTokensRepository,
  mailProvider
)
const sendForgotPasswordEmailController = new SendForgotPasswordEmailController(
  sendForgotPasswordEmailUseCase
)

const resetPasswordUseCase = new ResetPasswordUseCase(
  usersRepository,
  userTokensRepository,
  hashProvider
)
const resetPasswordController = new ResetPasswordController(
  resetPasswordUseCase
)

forgotPasswordRoutes.post(
  '/forgot-password',
  sendForgotPasswordEmailController.execute.bind(
    sendForgotPasswordEmailController
  )
)
forgotPasswordRoutes.post(
  '/forgot-password/reset',
  resetPasswordController.execute.bind(resetPasswordController)
)

export { forgotPasswordRoutes }
