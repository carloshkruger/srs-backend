import { Card } from '@entities/Card'
import { Deck } from '@entities/Deck'
import { StorageProvider } from '@providers/StorageProvider/StorageProvider.interface'
import { StorageProviderStub } from '@providers/StorageProvider/StorageProviderStub'
import { TextToSpeechProvider } from '@providers/TextToSpeechProvider/TextToSpeechProvider.interface'
import { TextToSpeechProviderStub } from '@providers/TextToSpeechProvider/TextToSpeechProviderStub'
import { CardsRepository } from '@repositories/CardsRepository'
import { DecksRepository } from '@repositories/DecksRepository'
import { CardsRepositoryStub } from '@repositories/stubs/CardsRepositoryStub'
import { DecksRepositoryStub } from '@repositories/stubs/DecksRepositoryStub'
import {
  CreateCardUseCase,
  MAXIMUM_DAILY_CARDS_CREATION_PER_USER
} from './CreateCardUseCase'
import {
  CardOriginalTextAlreadyCreated,
  DeckNotFound,
  MaximumDailyCardsCreationReached
} from './errors'

describe('CreateCardUseCase', () => {
  let createCardUseCase: CreateCardUseCase
  let decksRepository: DecksRepository
  let cardsRepository: CardsRepository
  let textToSpeechProvider: TextToSpeechProvider
  let storageProvider: StorageProvider

  beforeEach(() => {
    decksRepository = new DecksRepositoryStub()
    cardsRepository = new CardsRepositoryStub()
    textToSpeechProvider = new TextToSpeechProviderStub()
    storageProvider = new StorageProviderStub()
    createCardUseCase = new CreateCardUseCase(
      decksRepository,
      cardsRepository,
      textToSpeechProvider,
      storageProvider
    )
  })

  it('should throw if deck does not exists', async () => {
    const saveSpy = jest.spyOn(cardsRepository, 'save')
    jest.spyOn(decksRepository, 'findById').mockResolvedValue(undefined)

    await expect(
      createCardUseCase.execute({
        userId: '123456',
        deckId: 'id_that_does_not_exists',
        originalText: 'original text',
        translatedText: 'translated text'
      })
    ).rejects.toThrow(DeckNotFound)
    expect(saveSpy).not.toHaveBeenCalled()
  })

  it('should throw if the original text is already created for this deck', async () => {
    const saveSpy = jest.spyOn(cardsRepository, 'save')
    const deckId = '123456'
    const originalText = 'original text'

    jest.spyOn(decksRepository, 'findById').mockResolvedValue(
      Deck.create(
        {
          name: 'Deck name',
          userId: '123456',
          description: 'Deck description'
        },
        deckId
      )
    )

    jest
      .spyOn(cardsRepository, 'findByDeckIdAndOriginalText')
      .mockResolvedValue(
        Card.create({
          deckId,
          audioFileName: '',
          originalText,
          translatedText: 'translated text'
        })
      )

    await expect(
      createCardUseCase.execute({
        userId: '123456',
        deckId,
        originalText,
        translatedText: 'translated text'
      })
    ).rejects.toThrow(CardOriginalTextAlreadyCreated)
    expect(saveSpy).not.toHaveBeenCalled()
  })

  it('should throw if the maximum daily cards creation per user was reached', async () => {
    const saveSpy = jest.spyOn(cardsRepository, 'save')
    jest.spyOn(decksRepository, 'findById').mockResolvedValue(
      Deck.create({
        name: 'Deck name',
        userId: '123456',
        description: 'Deck description'
      })
    )
    jest
      .spyOn(cardsRepository, 'countCardsCreatedTodayByUser')
      .mockResolvedValue(MAXIMUM_DAILY_CARDS_CREATION_PER_USER)

    await expect(
      createCardUseCase.execute({
        userId: '123456',
        deckId: '123456',
        originalText: 'original text',
        translatedText: 'translated text'
      })
    ).rejects.toThrow(MaximumDailyCardsCreationReached)
    expect(saveSpy).not.toHaveBeenCalled()
  })

  it('should save the card', async () => {
    const audioBufferMock = Buffer.from('audio binary data')
    const createAudioSpy = jest
      .spyOn(textToSpeechProvider, 'createAudio')
      .mockResolvedValue(audioBufferMock)
    const saveFileSpy = jest.spyOn(storageProvider, 'saveFileFromBuffer')
    const saveSpy = jest.spyOn(cardsRepository, 'save')
    jest.spyOn(decksRepository, 'findById').mockResolvedValue(
      Deck.create({
        name: 'Deck name',
        userId: '123456',
        description: 'Deck description'
      })
    )

    await expect(
      createCardUseCase.execute({
        userId: '123456',
        deckId: '123456',
        originalText: 'original text',
        translatedText: 'translated text'
      })
    ).resolves.toBeInstanceOf(Card)
    expect(saveSpy).toHaveBeenCalled()
    expect(createAudioSpy).toHaveBeenCalledWith('original text')
    expect(saveFileSpy).toHaveBeenCalledWith({
      fileName: expect.any(String),
      bufferContent: audioBufferMock,
      filePath: [
        'users',
        '123456',
        'decks',
        '123456',
        'cards',
        expect.any(String)
      ]
    })
  })

  it('should delete the file on storage if occurs any error trying to save on database', async () => {
    const error = new Error('test error')
    const deleteFileSpy = jest.spyOn(storageProvider, 'deleteFile')
    const saveSpy = jest.spyOn(cardsRepository, 'save').mockRejectedValue(error)
    jest.spyOn(decksRepository, 'findById').mockResolvedValue(
      Deck.create({
        name: 'Deck name',
        userId: '123456',
        description: 'Deck description'
      })
    )

    await expect(
      createCardUseCase.execute({
        userId: '123456',
        deckId: '123456',
        originalText: 'original text',
        translatedText: 'translated text'
      })
    ).rejects.toThrow(error)
    expect(saveSpy).toHaveBeenCalled()
    expect(deleteFileSpy).toHaveBeenCalledWith({
      fileName: expect.any(String),
      filePath: [
        'users',
        '123456',
        'decks',
        '123456',
        'cards',
        expect.any(String)
      ]
    })
  })
})
