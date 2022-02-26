import { CardMockBuilder } from '@entities/mocks/CardMockBuilder'
import { StorageProvider } from '@providers/StorageProvider/StorageProvider.interface'
import { StorageProviderStub } from '@providers/StorageProvider/StorageProviderStub'
import { TextToSpeechProvider } from '@providers/TextToSpeechProvider/TextToSpeechProvider.interface'
import { TextToSpeechProviderStub } from '@providers/TextToSpeechProvider/TextToSpeechProviderStub'
import { CardsRepository } from '@repositories/CardsRepository'
import { DecksRepository } from '@repositories/DecksRepository'
import { CardsRepositoryStub } from '@repositories/stubs/CardsRepositoryStub'
import { DecksRepositoryStub } from '@repositories/stubs/DecksRepositoryStub'
import { CreateCardUseCase } from '@useCases/CreateCardUseCase'
import { Request } from 'express'
import { CreateCardController } from './CreateCardController'

describe('CreateCardController', () => {
  let controller: CreateCardController
  let useCase: CreateCardUseCase
  let decksRepository: DecksRepository
  let cardsRepository: CardsRepository
  let textToSpeechProvider: TextToSpeechProvider
  let storageProvider: StorageProvider

  beforeEach(() => {
    decksRepository = new DecksRepositoryStub()
    cardsRepository = new CardsRepositoryStub()
    textToSpeechProvider = new TextToSpeechProviderStub()
    storageProvider = new StorageProviderStub()
    useCase = new CreateCardUseCase(
      decksRepository,
      cardsRepository,
      textToSpeechProvider,
      storageProvider
    )
    controller = new CreateCardController(useCase)
  })

  it('should return 201 on success', async () => {
    const deckId = '123456'
    const originalText = 'original text'
    const translatedText = 'translated text'

    jest
      .spyOn(useCase, 'execute')
      .mockResolvedValue(
        CardMockBuilder.aCard()
          .withDeckId(deckId)
          .withOriginalText(originalText)
          .withTranslatedText(translatedText)
          .build()
      )

    const response = await controller.handle({
      body: {
        deckId: '123456',
        originalText: 'original text',
        translatedText: 'translated text'
      },
      user: {
        id: '123456'
      }
    } as Request)

    expect(response.statusCode).toBe(201)
    expect(response.body).toMatchObject({
      id: expect.any(String),
      deckId,
      originalText,
      translatedText
    })
  })
})
