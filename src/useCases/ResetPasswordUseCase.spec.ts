import { User } from '@entities/User'
import { UserToken } from '@entities/UserToken'
import { HashProvider } from '@providers/HashProvider/HashProvider.interface'
import { HashProviderStub } from '@providers/HashProvider/HashProviderStub'
import { UsersRepositoryStub } from '@repositories/stubs/UsersRepositoryStub'
import { UserTokensRepositoryStub } from '@repositories/stubs/UserTokensRepositoryStub'
import { UsersRepository } from '@repositories/UsersRepository'
import { UserTokensRepository } from '@repositories/UserTokensRepository'
import { TokenExpired, TokenNotFound, UserNotFound } from './errors'
import { ResetPasswordUseCase } from './ResetPasswordUseCase'

describe('ResetPasswordUseCase', () => {
  let usersRepository: UsersRepository
  let userTokensRepository: UserTokensRepository
  let hashProvider: HashProvider
  let useCase: ResetPasswordUseCase

  beforeEach(() => {
    usersRepository = new UsersRepositoryStub()
    userTokensRepository = new UserTokensRepositoryStub()
    hashProvider = new HashProviderStub()
    useCase = new ResetPasswordUseCase(
      usersRepository,
      userTokensRepository,
      hashProvider
    )
  })

  it('should throw if the token does not exists', async () => {
    const saveSpy = jest.spyOn(usersRepository, 'save')
    const deleteByIdSpy = jest.spyOn(userTokensRepository, 'deleteById')
    const hashSpy = jest.spyOn(hashProvider, 'hash')

    jest.spyOn(userTokensRepository, 'findByToken').mockResolvedValue(undefined)

    await expect(
      useCase.execute({
        token: 'token',
        password: '123456'
      })
    ).rejects.toThrow(TokenNotFound)

    expect(saveSpy).not.toHaveBeenCalled()
    expect(deleteByIdSpy).not.toHaveBeenCalled()
    expect(hashSpy).not.toHaveBeenCalled()
  })

  it('should throw if the token is expired', async () => {
    const saveSpy = jest.spyOn(usersRepository, 'save')
    const deleteByIdSpy = jest.spyOn(userTokensRepository, 'deleteById')
    const hashSpy = jest.spyOn(hashProvider, 'hash')

    const userToken = UserToken.create({
      userId: '123456',
      createdAt: new Date(),
      token: 'token'
    })

    userToken.isTokenExpired = () => true

    jest.spyOn(userTokensRepository, 'findByToken').mockResolvedValue(userToken)

    await expect(
      useCase.execute({
        token: 'token',
        password: '123456'
      })
    ).rejects.toThrow(TokenExpired)

    expect(saveSpy).not.toHaveBeenCalled()
    expect(deleteByIdSpy).not.toHaveBeenCalled()
    expect(hashSpy).not.toHaveBeenCalled()
  })

  it('should throw if the user does not exists', async () => {
    const saveSpy = jest.spyOn(usersRepository, 'save')
    const deleteByIdSpy = jest.spyOn(userTokensRepository, 'deleteById')
    const hashSpy = jest.spyOn(hashProvider, 'hash')

    const userToken = UserToken.create({
      userId: '123456',
      createdAt: new Date(),
      token: 'token'
    })

    userToken.isTokenExpired = () => false

    jest.spyOn(userTokensRepository, 'findByToken').mockResolvedValue(userToken)
    jest.spyOn(usersRepository, 'findById').mockResolvedValue(undefined)

    await expect(
      useCase.execute({
        token: 'token',
        password: '123456'
      })
    ).rejects.toThrow(UserNotFound)

    expect(saveSpy).not.toHaveBeenCalled()
    expect(deleteByIdSpy).not.toHaveBeenCalled()
    expect(hashSpy).not.toHaveBeenCalled()
  })

  it('should update user and delete token', async () => {
    const saveSpy = jest.spyOn(usersRepository, 'save')
    const deleteByIdSpy = jest.spyOn(userTokensRepository, 'deleteById')
    const hashSpy = jest.spyOn(hashProvider, 'hash')

    const userTokenId = '123'
    const userToken = UserToken.create(
      {
        userId: '123456',
        createdAt: new Date(),
        token: 'token'
      },
      userTokenId
    )

    userToken.isTokenExpired = () => false

    jest.spyOn(userTokensRepository, 'findByToken').mockResolvedValue(userToken)
    jest.spyOn(usersRepository, 'findById').mockResolvedValue(
      User.create({
        email: 'email@test.com',
        name: 'test user'
      })
    )

    const newPassword = '123456'

    await expect(
      useCase.execute({
        token: 'token',
        password: newPassword
      })
    ).resolves.toBeUndefined()

    expect(saveSpy).toHaveBeenCalled()
    expect(deleteByIdSpy).toHaveBeenCalledWith(userTokenId)
    expect(hashSpy).toHaveBeenCalledWith(newPassword)
  })
})
