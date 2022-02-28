import { DeckMockBuilder } from '@entities/mocks/DeckMockBuilder'
import { UserMockBuilder } from '@entities/mocks/UserMockBuilder'
import { StorageProvider } from '@providers/StorageProvider/StorageProvider.interface'
import { StorageProviderStub } from '@providers/StorageProvider/StorageProviderStub'
import { DecksRepository } from '@repositories/DecksRepository'
import { DecksRepositoryStub } from '@repositories/stubs/DecksRepositoryStub'
import { UsersRepositoryStub } from '@repositories/stubs/UsersRepositoryStub'
import { UsersRepository } from '@repositories/UsersRepository'
import { DeleteDeckUseCase } from './DeleteDeckUseCase'
import {
  DeckDoesNotBelongToTheUser,
  DeckNotFound,
  UserNotFound
} from './errors'

describe('DeleteDeckUseCase', () => {
  let deleteDeckUseCase: DeleteDeckUseCase
  let usersRepository: UsersRepository
  let decksRepository: DecksRepository
  let storageProvider: StorageProvider

  beforeEach(() => {
    usersRepository = new UsersRepositoryStub()
    decksRepository = new DecksRepositoryStub()
    storageProvider = new StorageProviderStub()
    deleteDeckUseCase = new DeleteDeckUseCase(
      usersRepository,
      decksRepository,
      storageProvider
    )
  })

  it('should throw if the user does not exists', async () => {
    const deleteSpy = jest.spyOn(decksRepository, 'deleteById')
    const deleteFolderSpy = jest.spyOn(storageProvider, 'deleteFolder')
    jest.spyOn(usersRepository, 'findById').mockResolvedValue(undefined)

    await expect(
      deleteDeckUseCase.execute({
        userId: '123456',
        deckId: '123456'
      })
    ).rejects.toThrow(UserNotFound)
    expect(deleteSpy).not.toHaveBeenCalled()
    expect(deleteFolderSpy).not.toHaveBeenCalled()
  })

  it('should throw if the deck does not exists', async () => {
    const deleteSpy = jest.spyOn(decksRepository, 'deleteById')
    const deleteFolderSpy = jest.spyOn(storageProvider, 'deleteFolder')
    jest
      .spyOn(usersRepository, 'findById')
      .mockResolvedValue(UserMockBuilder.aUser().build())
    jest.spyOn(decksRepository, 'findById').mockResolvedValue(undefined)

    await expect(
      deleteDeckUseCase.execute({
        userId: '123456',
        deckId: '123456'
      })
    ).rejects.toThrow(DeckNotFound)
    expect(deleteSpy).not.toHaveBeenCalled()
    expect(deleteFolderSpy).not.toHaveBeenCalled()
  })

  it('should throw if the deck does not belong to the user', async () => {
    const deleteSpy = jest.spyOn(decksRepository, 'deleteById')
    const deleteFolderSpy = jest.spyOn(storageProvider, 'deleteFolder')
    jest
      .spyOn(usersRepository, 'findById')
      .mockResolvedValue(UserMockBuilder.aUser().build())
    jest
      .spyOn(decksRepository, 'findById')
      .mockResolvedValue(DeckMockBuilder.aDeck().build())

    await expect(
      deleteDeckUseCase.execute({
        userId: 'different_user_id',
        deckId: '123456'
      })
    ).rejects.toThrow(DeckDoesNotBelongToTheUser)
    expect(deleteSpy).not.toHaveBeenCalled()
    expect(deleteFolderSpy).not.toHaveBeenCalled()
  })

  it('should delete the deck', async () => {
    const userId = '123456'
    const deckId = '12345678'

    const deleteSpy = jest.spyOn(decksRepository, 'deleteById')
    const deleteFolderSpy = jest.spyOn(storageProvider, 'deleteFolder')
    jest
      .spyOn(usersRepository, 'findById')
      .mockResolvedValue(UserMockBuilder.aUser().withId(userId).build())

    jest
      .spyOn(decksRepository, 'findById')
      .mockResolvedValue(DeckMockBuilder.aDeck().withId(deckId).build())

    await expect(
      deleteDeckUseCase.execute({
        userId,
        deckId
      })
    ).resolves.toBeUndefined()

    expect(deleteSpy).toHaveBeenCalledWith(deckId)
    expect(deleteFolderSpy).toHaveBeenCalledWith([
      'users',
      userId,
      'decks',
      deckId
    ])
  })
})
