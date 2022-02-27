import { ResetPasswordController } from '@api/ResetPasswordController'
import { SendForgotPasswordEmailController } from '@api/SendForgotPasswordEmailController'
import { HashProviderStub } from '@providers/HashProvider/HashProviderStub'
import { MailProviderStub } from '@providers/MailProvider/MailProviderStub'
import { UsersRepositoryStub } from '@repositories/stubs/UsersRepositoryStub'
import { UserTokensRepositoryStub } from '@repositories/stubs/UserTokensRepositoryStub'
import { ResetPasswordUseCase } from '@useCases/ResetPasswordUseCase'
import { SendForgotPasswordEmailUseCase } from '@useCases/SendForgotPasswordEmailUseCase'
import { Router } from 'express'

const forgotPasswordRoutes = Router()

const usersRepository = new UsersRepositoryStub()
const userTokensRepository = new UserTokensRepositoryStub()
const hashProvider = new HashProviderStub()
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
