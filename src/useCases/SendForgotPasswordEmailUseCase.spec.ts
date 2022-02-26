import { UserMockBuilder } from '@entities/mocks/UserMockBuilder'
import { MailProvider } from '@providers/MailProvider/MailProvider'
import { MailProviderStub } from '@providers/MailProvider/MailProviderStub'
import { UsersRepositoryStub } from '@repositories/stubs/UsersRepositoryStub'
import { UserTokensRepositoryStub } from '@repositories/stubs/UserTokensRepositoryStub'
import { UsersRepository } from '@repositories/UsersRepository'
import { UserTokensRepository } from '@repositories/UserTokensRepository'
import { SendForgotPasswordEmailUseCase } from './SendForgotPasswordEmailUseCase'

jest.mock('path')

describe('SendForgotPasswordEmailUseCase', () => {
  let usersRepository: UsersRepository
  let userTokensRepository: UserTokensRepository
  let mailProvider: MailProvider
  let useCase: SendForgotPasswordEmailUseCase

  beforeEach(() => {
    usersRepository = new UsersRepositoryStub()
    userTokensRepository = new UserTokensRepositoryStub()
    mailProvider = new MailProviderStub()
    useCase = new SendForgotPasswordEmailUseCase(
      usersRepository,
      userTokensRepository,
      mailProvider
    )
  })

  it('should return without error if the user does not exists', async () => {
    const saveSpy = jest.spyOn(userTokensRepository, 'save')
    const sendMailSpy = jest.spyOn(mailProvider, 'sendMail')

    jest.spyOn(usersRepository, 'findByEmail').mockResolvedValue(undefined)

    await expect(
      useCase.execute({
        email: 'testemail@email.com'
      })
    ).resolves.toBeUndefined()

    expect(saveSpy).not.toHaveBeenCalled()
    expect(sendMailSpy).not.toHaveBeenCalled()
  })

  it('should save the token in database and send email', async () => {
    const saveSpy = jest.spyOn(userTokensRepository, 'save')
    const sendMailSpy = jest.spyOn(mailProvider, 'sendMail')

    jest
      .spyOn(usersRepository, 'findByEmail')
      .mockResolvedValue(UserMockBuilder.aUser().build())

    await expect(
      useCase.execute({
        email: 'testemail@email.com'
      })
    ).resolves.toBeUndefined()

    expect(saveSpy).toHaveBeenCalled()
    expect(sendMailSpy).toHaveBeenCalled()
  })
})
