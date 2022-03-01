import { ResetPasswordController } from '@api/ResetPasswordController'
import { SendForgotPasswordEmailController } from '@api/SendForgotPasswordEmailController'
import { hashProvider } from '@providers/HashProvider'
import { mailProvider } from '@providers/MailProvider'
import { usersRepository, userTokensRepository } from '@repositories/index'
import { ResetPasswordUseCase } from '@useCases/ResetPasswordUseCase'
import { SendForgotPasswordEmailUseCase } from '@useCases/SendForgotPasswordEmailUseCase'
import { celebrate, Segments } from 'celebrate'
import { Router } from 'express'
import Joi from 'joi'

const forgotPasswordRoutes = Router()

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
  celebrate({
    [Segments.BODY]: {
      email: Joi.string().email().required()
    }
  }),
  sendForgotPasswordEmailController.execute.bind(
    sendForgotPasswordEmailController
  )
)
forgotPasswordRoutes.post(
  '/forgot-password/reset',
  celebrate({
    [Segments.BODY]: {
      token: Joi.string().required(),
      password: Joi.string().min(6).required()
    }
  }),
  resetPasswordController.execute.bind(resetPasswordController)
)

export { forgotPasswordRoutes }
