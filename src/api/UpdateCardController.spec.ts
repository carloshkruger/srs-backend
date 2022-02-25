import { StorageProvider } from '@providers/StorageProvider/StorageProvider.interface'
import { StorageProviderStub } from '@providers/StorageProvider/StorageProviderStub'
import { TextToSpeechProvider } from '@providers/TextToSpeechProvider/TextToSpeechProvider.interface'
import { TextToSpeechProviderStub } from '@providers/TextToSpeechProvider/TextToSpeechProviderStub'
import { CardsRepository } from '@repositories/CardsRepository'
import { DecksRepository } from '@repositories/DecksRepository'
import { CardsRepositoryStub } from '@repositories/stubs/CardsRepositoryStub'
import { DecksRepositoryStub } from '@repositories/stubs/DecksRepositoryStub'
import { UpdateCardUseCase } from '@useCases/UpdateCardUseCase'
import { Request } from 'express'
import { UpdateCardController } from './UpdateCardController'

describe('UpdateCardController', () => {
  let controller: UpdateCardController
  let useCase: UpdateCardUseCase
  let decksRepository: DecksRepository
  let cardsRepository: CardsRepository
  let textToSpeechProvider: TextToSpeechProvider
  let storageProvider: StorageProvider

  beforeEach(() => {
    decksRepository = new DecksRepositoryStub()
    cardsRepository = new CardsRepositoryStub()
    textToSpeechProvider = new TextToSpeechProviderStub()
    storageProvider = new StorageProviderStub()
    useCase = new UpdateCardUseCase(
      decksRepository,
      cardsRepository,
      textToSpeechProvider,
      storageProvider
    )
    controller = new UpdateCardController(useCase)
  })

  it('should return 204 on success', async () => {
    jest.spyOn(useCase, 'execute').mockResolvedValue(undefined)

    const response = await controller.handle({
      body: {
        originalText: 'original text',
        translatedText: 'translated text'
      },
      user: {
        id: '123456'
      },
      params: {
        cardId: '123456'
      }
    } as unknown as Request)

    expect(response.statusCode).toBe(204)
    expect(response.body).toBeUndefined()
  })
})
