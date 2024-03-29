import { CardMockBuilder } from '@entities/mocks/CardMockBuilder'
import { DeckMockBuilder } from '@entities/mocks/DeckMockBuilder'
import { StorageProvider } from '@providers/StorageProvider/StorageProvider.interface'
import { StorageProviderStub } from '@providers/StorageProvider/StorageProviderStub'
import { CardsRepository } from '@repositories/CardsRepository'
import { DecksRepository } from '@repositories/DecksRepository'
import { CardsRepositoryStub } from '@repositories/stubs/CardsRepositoryStub'
import { DecksRepositoryStub } from '@repositories/stubs/DecksRepositoryStub'
import { DeleteCardUseCase } from './DeleteCardUseCase'
import { CardDoesNotBelongToTheUser, CardNotFound } from './errors'

describe('DeleteCardUseCase', () => {
  let deleteCardUseCase: DeleteCardUseCase
  let decksRepository: DecksRepository
  let cardsRepository: CardsRepository
  let storageProvider: StorageProvider

  beforeEach(() => {
    decksRepository = new DecksRepositoryStub()
    cardsRepository = new CardsRepositoryStub()
    storageProvider = new StorageProviderStub()
    deleteCardUseCase = new DeleteCardUseCase(
      decksRepository,
      cardsRepository,
      storageProvider
    )
  })

  it('should throw if deck does not exists', async () => {
    const deleteByIdSpy = jest.spyOn(cardsRepository, 'deleteById')
    const deleteFolderSpy = jest.spyOn(storageProvider, 'deleteFolder')

    await expect(
      deleteCardUseCase.execute({
        userId: '123456',
        cardId: '123456'
      })
    ).rejects.toThrow(CardNotFound)
    expect(deleteByIdSpy).not.toHaveBeenCalled()
    expect(deleteFolderSpy).not.toHaveBeenCalled()
  })

  it('should throw if the card does not belong to this user', async () => {
    const deckId = '123456'
    const ownerUserId = '123456'
    const userIdTryingToUpdateCard = '654321'

    const deleteByIdSpy = jest.spyOn(cardsRepository, 'deleteById')
    const deleteFolderSpy = jest.spyOn(storageProvider, 'deleteFolder')

    jest
      .spyOn(cardsRepository, 'findById')
      .mockResolvedValue(CardMockBuilder.aCard().withDeckId(deckId).build())

    jest
      .spyOn(decksRepository, 'findById')
      .mockResolvedValue(
        DeckMockBuilder.aDeck().withId(deckId).withUserId(ownerUserId).build()
      )

    await expect(
      deleteCardUseCase.execute({
        userId: userIdTryingToUpdateCard,
        cardId: '123456'
      })
    ).rejects.toThrow(CardDoesNotBelongToTheUser)
    expect(deleteByIdSpy).not.toHaveBeenCalled()
    expect(deleteFolderSpy).not.toHaveBeenCalled()
  })

  it('should delete the card', async () => {
    const deckId = '123456'

    const deleteByIdSpy = jest.spyOn(cardsRepository, 'deleteById')
    const deleteFolderSpy = jest.spyOn(storageProvider, 'deleteFolder')

    jest
      .spyOn(cardsRepository, 'findById')
      .mockResolvedValue(CardMockBuilder.aCard().withDeckId(deckId).build())
    jest
      .spyOn(decksRepository, 'findById')
      .mockResolvedValue(DeckMockBuilder.aDeck().withId(deckId).build())

    const cardId = '12345'

    await expect(
      deleteCardUseCase.execute({
        userId: '123456',
        cardId
      })
    ).resolves.toBeUndefined()
    expect(deleteByIdSpy).toHaveBeenCalledWith(cardId)
    expect(deleteFolderSpy).toHaveBeenCalledWith(expect.any(Array))
  })
})
