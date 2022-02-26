import { MailProvider } from '@providers/MailProvider/MailProvider'
import { MailProviderStub } from '@providers/MailProvider/MailProviderStub'
import { UsersRepositoryStub } from '@repositories/stubs/UsersRepositoryStub'
import { UserTokensRepositoryStub } from '@repositories/stubs/UserTokensRepositoryStub'
import { UsersRepository } from '@repositories/UsersRepository'
import { UserTokensRepository } from '@repositories/UserTokensRepository'
import { DeleteUserUseCase } from '@useCases/DeleteUserUseCase'
import { SendForgotPasswordEmailUseCase } from '@useCases/SendForgotPasswordEmailUseCase'
import { Request } from 'express'
import { DeleteUserController } from './DeleteUserController'
import { SendForgotPasswordEmailController } from './SendForgotPasswordEmailController'

describe('SendForgotPasswordEmailController', () => {
  let controller: SendForgotPasswordEmailController
  let useCase: SendForgotPasswordEmailUseCase
  let usersRepository: UsersRepository
  let userTokensRepository: UserTokensRepository
  let mailProvider: MailProvider

  beforeEach(() => {
    usersRepository = new UsersRepositoryStub()
    userTokensRepository = new UserTokensRepositoryStub()
    mailProvider = new MailProviderStub()
    useCase = new SendForgotPasswordEmailUseCase(
      usersRepository,
      userTokensRepository,
      mailProvider
    )
    controller = new SendForgotPasswordEmailController(useCase)
  })

  it('should return 204 on success', async () => {
    jest.spyOn(useCase, 'execute').mockResolvedValue()

    const response = await controller.handle({
      body: {
        email: 'testemail@email.com'
      }
    } as Request)

    expect(response.statusCode).toBe(204)
    expect(response.body).toBeUndefined()
  })
})
