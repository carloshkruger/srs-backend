import { HashProvider } from '@providers/HashProvider/HashProvider.interface'
import { HashProviderStub } from '@providers/HashProvider/HashProviderStub'
import { UsersRepositoryStub } from '@repositories/stubs/UsersRepositoryStub'
import { UserTokensRepositoryStub } from '@repositories/stubs/UserTokensRepositoryStub'
import { UsersRepository } from '@repositories/UsersRepository'
import { UserTokensRepository } from '@repositories/UserTokensRepository'
import { ResetPasswordUseCase } from '@useCases/ResetPasswordUseCase'
import { Request } from 'express'
import { ResetPasswordController } from './ResetPasswordController'

describe('ResetPasswordController', () => {
  let controller: ResetPasswordController
  let useCase: ResetPasswordUseCase
  let usersRepository: UsersRepository
  let userTokensRepository: UserTokensRepository
  let hashProvider: HashProvider

  beforeEach(() => {
    usersRepository = new UsersRepositoryStub()
    userTokensRepository = new UserTokensRepositoryStub()
    hashProvider = new HashProviderStub()
    useCase = new ResetPasswordUseCase(
      usersRepository,
      userTokensRepository,
      hashProvider
    )
    controller = new ResetPasswordController(useCase)
  })

  it('should return 204 on success', async () => {
    jest.spyOn(useCase, 'execute').mockResolvedValue()

    const response = await controller.handle({
      body: {
        token: 'token',
        password: '123456'
      }
    } as Request)

    expect(response.statusCode).toBe(204)
    expect(response.body).toBeUndefined()
  })
})
