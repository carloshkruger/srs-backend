import { User } from '@entities/User'
import { HashProvider } from '@providers/HashProvider/HashProvider.interface'
import { HashProviderStub } from '@providers/HashProvider/HashProviderStub'
import { UsersRepositoryStub } from '@repositories/stubs/UsersRepositoryStub'
import { UsersRepository } from '@repositories/UsersRepository'
import { UserNotFound } from './errors'
import { PasswordIncorrect } from './errors/PasswordIncorrect'
import { UpdatePasswordUseCase } from './UpdatePasswordUseCase'

describe('UpdatePasswordUseCase', () => {
  let updatePasswordUseCase: UpdatePasswordUseCase
  let usersRepository: UsersRepository
  let hashProvider: HashProvider

  beforeEach(() => {
    usersRepository = new UsersRepositoryStub()
    hashProvider = new HashProviderStub()
    updatePasswordUseCase = new UpdatePasswordUseCase(
      usersRepository,
      hashProvider
    )
  })

  it('should throw an error if user does not exists', async () => {
    const saveSpy = jest.spyOn(usersRepository, 'save')

    await expect(
      updatePasswordUseCase.execute({
        userId: '123123',
        currentPassword: '123456',
        newPassword: '654321'
      })
    ).rejects.toThrow(UserNotFound)
    expect(saveSpy).not.toHaveBeenCalled()
  })

  it('should throw an error if the current password is incorrect', async () => {
    const saveSpy = jest.spyOn(usersRepository, 'save')
    jest.spyOn(usersRepository, 'findById').mockResolvedValue(
      User.create({
        name: 'Test User',
        email: 'testuser@email.com',
        password: '123456'
      })
    )
    jest.spyOn(hashProvider, 'compare').mockResolvedValue(false)

    await expect(
      updatePasswordUseCase.execute({
        userId: '123123',
        currentPassword: '123456',
        newPassword: '654321'
      })
    ).rejects.toThrow(PasswordIncorrect)
    expect(saveSpy).not.toHaveBeenCalled()
  })

  it('should save the user with the new password', async () => {
    const saveSpy = jest.spyOn(usersRepository, 'save')
    const hashSpy = jest.spyOn(hashProvider, 'hash')

    jest.spyOn(usersRepository, 'findById').mockResolvedValue(
      User.create({
        name: 'Test User',
        email: 'testuser@email.com',
        password: '123456'
      })
    )
    jest.spyOn(hashProvider, 'compare').mockResolvedValue(true)

    const currentPassword = 'current_password'
    const newPassword = 'new_password'

    await expect(
      updatePasswordUseCase.execute({
        userId: '123123',
        currentPassword,
        newPassword
      })
    ).resolves.toBeUndefined()
    expect(saveSpy).toHaveBeenCalled()
    expect(hashSpy).toHaveBeenCalledWith(newPassword)

    const userPassedToSaveMethod = saveSpy.mock.calls[0][0]
    expect(userPassedToSaveMethod.password).not.toBe(currentPassword)
  })
})
