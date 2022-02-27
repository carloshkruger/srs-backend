import { UserMockBuilder } from '@entities/mocks/UserMockBuilder'
import { AuthTokenProvider } from '@providers/AuthTokenProvider/AuthTokenProvider.interface'
import { AuthTokenProviderStub } from '@providers/AuthTokenProvider/AuthTokenProviderStub'
import { HashProvider } from '@providers/HashProvider/HashProvider.interface'
import { HashProviderStub } from '@providers/HashProvider/HashProviderStub'
import { UsersRepositoryStub } from '@repositories/stubs/UsersRepositoryStub'
import { UsersRepository } from '@repositories/UsersRepository'
import { AuthenticateUserWithEmailAndPasswordUseCase } from '@useCases/AuthenticateUserWithEmailAndPasswordUseCase'
import { IncorrectCredentials } from './errors'

describe('AuthenticateUserWithEmailAndPasswordUseCase', () => {
  let usersRepository: UsersRepository
  let hashProvider: HashProvider
  let authTokenProvider: AuthTokenProvider
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
  })

  it('should throw if the user does not exists', async () => {
    const generateTokenSpy = jest.spyOn(authTokenProvider, 'generate')
    jest.spyOn(usersRepository, 'findByEmail').mockResolvedValue(undefined)

    await expect(
      useCase.execute({
        email: 'email@email.com',
        password: '123456'
      })
    ).rejects.toThrow(IncorrectCredentials)
    expect(generateTokenSpy).not.toHaveBeenCalled()
  })

  it('should throw if the password is incorrect', async () => {
    const generateTokenSpy = jest.spyOn(authTokenProvider, 'generate')
    jest
      .spyOn(usersRepository, 'findByEmail')
      .mockResolvedValue(UserMockBuilder.aUser().build())
    jest.spyOn(hashProvider, 'compare').mockResolvedValue(false)

    await expect(
      useCase.execute({
        email: 'email@email.com',
        password: '123456'
      })
    ).rejects.toThrow(IncorrectCredentials)
    expect(generateTokenSpy).not.toHaveBeenCalled()
  })

  it('should create the token', async () => {
    const token = 'token'
    const user = UserMockBuilder.aUser().build()
    jest.spyOn(usersRepository, 'findByEmail').mockResolvedValue(user)
    jest.spyOn(hashProvider, 'compare').mockResolvedValue(true)
    jest.spyOn(authTokenProvider, 'generate').mockReturnValue(token)

    await expect(
      useCase.execute({
        email: 'email@email.com',
        password: '123456'
      })
    ).resolves.toMatchObject({
      user,
      token
    })
  })
})
