import { UserMockBuilder } from '@entities/mocks/UserMockBuilder'
import { AuthTokenProvider } from '@providers/AuthTokenProvider/AuthTokenProvider.interface'
import { AuthTokenProviderStub } from '@providers/AuthTokenProvider/AuthTokenProviderStub'
import { HashProvider } from '@providers/HashProvider/HashProvider.interface'
import { HashProviderStub } from '@providers/HashProvider/HashProviderStub'
import { UsersRepositoryStub } from '@repositories/stubs/UsersRepositoryStub'
import { UsersRepository } from '@repositories/UsersRepository'
import { AuthenticateUserWithEmailAndPasswordUseCase } from '@useCases/AuthenticateUserWithEmailAndPasswordUseCase'
import { Request } from 'express'
import { AuthenticateUserWithEmailAndPasswordController } from './AuthenticateUserWithEmailAndPasswordController'

describe('CreateCardController', () => {
  let usersRepository: UsersRepository
  let hashProvider: HashProvider
  let authTokenProvider: AuthTokenProvider
  let controller: AuthenticateUserWithEmailAndPasswordController
  let useCase: AuthenticateUserWithEmailAndPasswordUseCase

  beforeEach(() => {
    usersRepository = new UsersRepositoryStub()
    hashProvider = new HashProviderStub()
    authTokenProvider = new AuthTokenProviderStub()
    useCase = new AuthenticateUserWithEmailAndPasswordUseCase(
      usersRepository,
      hashProvider,
      authTokenProvider
    )
    controller = new AuthenticateUserWithEmailAndPasswordController(useCase)
  })

  it('should return 200 on success', async () => {
    jest.spyOn(useCase, 'execute').mockResolvedValue({
      user: UserMockBuilder.aUser().build(),
      token: 'token'
    })

    const response = await controller.handle({
      body: {
        email: 'email@email.com',
        password: '123456'
      }
    } as Request)

    expect(response.statusCode).toBe(200)
    expect(response.body).toMatchObject({
      user: expect.anything(),
      token: 'token'
    })
  })
})
