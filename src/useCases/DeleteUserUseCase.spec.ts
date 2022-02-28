import { UserMockBuilder } from '@entities/mocks/UserMockBuilder'
import { StorageProvider } from '@providers/StorageProvider/StorageProvider.interface'
import { StorageProviderStub } from '@providers/StorageProvider/StorageProviderStub'
import { UsersRepositoryStub } from '@repositories/stubs/UsersRepositoryStub'
import { UsersRepository } from '@repositories/UsersRepository'
import { DeleteUserUseCase } from './DeleteUserUseCase'
import { UserNotFound } from './errors'

describe('DeleteUserUseCase', () => {
  let deleteUserUseCase: DeleteUserUseCase
  let usersRepository: UsersRepository
  let storageProvider: StorageProvider

  beforeEach(() => {
    usersRepository = new UsersRepositoryStub()
    storageProvider = new StorageProviderStub()
    deleteUserUseCase = new DeleteUserUseCase(usersRepository, storageProvider)
  })

  it('should throw an error if the user was not found', async () => {
    jest.spyOn(usersRepository, 'findById').mockResolvedValue(undefined)
    const deleteSpy = jest.spyOn(usersRepository, 'deleteById')
    const deleteFolderSpy = jest.spyOn(storageProvider, 'deleteFolder')

    await expect(
      deleteUserUseCase.execute({
        userId: '123456'
      })
    ).rejects.toThrow(UserNotFound)
    expect(deleteSpy).not.toHaveBeenCalled()
    expect(deleteFolderSpy).not.toHaveBeenCalled()
  })

  it('should delete the user', async () => {
    const userId = '123456'

    jest
      .spyOn(usersRepository, 'findById')
      .mockResolvedValue(UserMockBuilder.aUser().withId(userId).build())
    const deleteSpy = jest.spyOn(usersRepository, 'deleteById')
    const deleteFolderSpy = jest.spyOn(storageProvider, 'deleteFolder')

    await expect(
      deleteUserUseCase.execute({
        userId
      })
    ).resolves.toBeUndefined()
    expect(deleteSpy).toHaveBeenCalledWith(userId)
    expect(deleteFolderSpy).toHaveBeenCalledWith(['users', userId])
  })
})
