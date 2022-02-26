import { Deck } from '@entities/Deck'
import { CardMockBuilder } from '@entities/mocks/CardMockBuilder'
import { StorageProvider } from '@providers/StorageProvider/StorageProvider.interface'
import { StorageProviderStub } from '@providers/StorageProvider/StorageProviderStub'
import { TextToSpeechProvider } from '@providers/TextToSpeechProvider/TextToSpeechProvider.interface'
import { TextToSpeechProviderStub } from '@providers/TextToSpeechProvider/TextToSpeechProviderStub'
import { CardsRepository } from '@repositories/CardsRepository'
import { DecksRepository } from '@repositories/DecksRepository'
import { CardsRepositoryStub } from '@repositories/stubs/CardsRepositoryStub'
import { DecksRepositoryStub } from '@repositories/stubs/DecksRepositoryStub'
import {
  CardDoesNotBelongToTheUser,
  CardNotFound,
  CardOriginalTextAlreadyCreated
} from './errors'
import { UpdateCardUseCase } from './UpdateCardUseCase'

describe('UpdateCardUseCase', () => {
  let updateCardUseCase: UpdateCardUseCase
  let decksRepository: DecksRepository
  let cardsRepository: CardsRepository
  let textToSpeechProvider: TextToSpeechProvider
  let storageProvider: StorageProvider

  beforeEach(() => {
    decksRepository = new DecksRepositoryStub()
    cardsRepository = new CardsRepositoryStub()
    textToSpeechProvider = new TextToSpeechProviderStub()
    storageProvider = new StorageProviderStub()
    updateCardUseCase = new UpdateCardUseCase(
      decksRepository,
      cardsRepository,
      textToSpeechProvider,
      storageProvider
    )
  })

  it('should throw if card does not exists', async () => {
    const saveSpy = jest.spyOn(cardsRepository, 'save')
    jest.spyOn(cardsRepository, 'findById').mockResolvedValue(undefined)

    await expect(
      updateCardUseCase.execute({
        userId: '123456',
        cardId: 'id_that_does_not_exists',
        originalText: 'original text',
        translatedText: 'translated text'
      })
    ).rejects.toThrow(CardNotFound)
    expect(saveSpy).not.toHaveBeenCalled()
  })

  it('should throw if the card does not belong to this user', async () => {
    const saveSpy = jest.spyOn(cardsRepository, 'save')
    const deckId = '123456'
    const ownerUserId = '123456'
    const userIdTryingToUpdateCard = '654321'

    jest
      .spyOn(cardsRepository, 'findByDeckIdAndOriginalText')
      .mockResolvedValue(undefined)

    jest
      .spyOn(cardsRepository, 'findById')
      .mockResolvedValue(
        CardMockBuilder.aCard().withId('123456').withDeckId(deckId).build()
      )

    jest.spyOn(decksRepository, 'findById').mockResolvedValue(
      Deck.create(
        {
          name: 'Deck name',
          userId: ownerUserId,
          description: 'Deck description'
        },
        deckId
      )
    )

    await expect(
      updateCardUseCase.execute({
        userId: userIdTryingToUpdateCard,
        cardId: '123456',
        originalText: 'original text',
        translatedText: 'translated text'
      })
    ).rejects.toThrow(CardDoesNotBelongToTheUser)
    expect(saveSpy).not.toHaveBeenCalled()
  })

  it('should throw if the original text is already created for this deck', async () => {
    const saveSpy = jest.spyOn(cardsRepository, 'save')
    const deckId = '123456'
    const originalText = 'original text'

    jest
      .spyOn(cardsRepository, 'findById')
      .mockResolvedValue(
        CardMockBuilder.aCard()
          .withId('123456')
          .withDeckId(deckId)
          .withOriginalText(originalText)
          .build()
      )
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
        CardMockBuilder.aCard()
          .withDeckId(deckId)
          .withOriginalText(originalText)
          .build()
      )

    await expect(
      updateCardUseCase.execute({
        userId: '123456',
        cardId: '123456',
        originalText,
        translatedText: 'translated text'
      })
    ).rejects.toThrow(CardOriginalTextAlreadyCreated)
    expect(saveSpy).not.toHaveBeenCalled()
  })

  it('should create a new audio file, save on storage provider and delete old audio file if the original text changes', async () => {
    const audioBufferMock = Buffer.from('audio binary data')
    const createAudioSpy = jest
      .spyOn(textToSpeechProvider, 'createAudio')
      .mockResolvedValue(audioBufferMock)
    const saveFileSpy = jest.spyOn(storageProvider, 'saveFileFromBuffer')
    const deleteFileSpy = jest.spyOn(storageProvider, 'deleteFile')
    const saveSpy = jest.spyOn(cardsRepository, 'save')
    const deckId = '123456'
    const oldOriginalText = 'old original text'
    const newOriginalText = 'new original text'
    const audioFileName = 'audio.mp3'
    const cardId = '123456'

    jest
      .spyOn(cardsRepository, 'findByDeckIdAndOriginalText')
      .mockResolvedValue(undefined)
    jest
      .spyOn(cardsRepository, 'findById')
      .mockResolvedValue(
        CardMockBuilder.aCard()
          .withId(cardId)
          .withDeckId(deckId)
          .withAudioFileName(audioFileName)
          .withOriginalText(oldOriginalText)
          .build()
      )
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

    await expect(
      updateCardUseCase.execute({
        userId: '123456',
        cardId,
        originalText: newOriginalText,
        translatedText: 'translated text'
      })
    ).resolves.not.toThrow()
    expect(createAudioSpy).toHaveBeenCalledWith(newOriginalText)
    expect(saveFileSpy).toHaveBeenCalledWith({
      fileName: expect.any(String),
      bufferContent: audioBufferMock,
      filePath: [
        'users',
        '123456',
        'decks',
        deckId,
        'cards',
        expect.any(String)
      ]
    })
    expect(deleteFileSpy).toHaveBeenCalledWith({
      fileName: audioFileName,
      filePath: ['users', '123456', 'decks', deckId, 'cards', cardId]
    })
    expect(saveSpy).toHaveBeenCalled()
  })

  it('should delete the recently created audio file if any error occur when saving on database', async () => {
    const error = new Error()
    const audioBufferMock = Buffer.from('audio binary data')
    const createAudioSpy = jest
      .spyOn(textToSpeechProvider, 'createAudio')
      .mockResolvedValue(audioBufferMock)
    const saveFileSpy = jest.spyOn(storageProvider, 'saveFileFromBuffer')
    const deleteFileSpy = jest.spyOn(storageProvider, 'deleteFile')
    const saveSpy = jest.spyOn(cardsRepository, 'save').mockRejectedValue(error)
    const deckId = '123456'
    const oldOriginalText = 'old original text'
    const newOriginalText = 'new original text'
    const audioFileName = 'audio.mp3'
    const cardId = '123456'

    jest
      .spyOn(cardsRepository, 'findByDeckIdAndOriginalText')
      .mockResolvedValue(undefined)
    jest
      .spyOn(cardsRepository, 'findById')
      .mockResolvedValue(
        CardMockBuilder.aCard()
          .withId(cardId)
          .withDeckId(deckId)
          .withAudioFileName(audioFileName)
          .withOriginalText(oldOriginalText)
          .build()
      )
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

    await expect(
      updateCardUseCase.execute({
        userId: '123456',
        cardId,
        originalText: newOriginalText,
        translatedText: 'translated text'
      })
    ).rejects.toThrow(error)
    expect(createAudioSpy).toHaveBeenCalledWith(newOriginalText)
    expect(saveFileSpy).toHaveBeenCalledWith({
      fileName: expect.any(String),
      bufferContent: audioBufferMock,
      filePath: [
        'users',
        '123456',
        'decks',
        deckId,
        'cards',
        expect.any(String)
      ]
    })
    expect(deleteFileSpy).toHaveBeenCalledWith({
      fileName: expect.any(String),
      filePath: ['users', '123456', 'decks', deckId, 'cards', cardId]
    })
    expect(saveSpy).toHaveBeenCalled()
  })

  it('should not create an audio file or delete an existing one', async () => {
    const createAudioSpy = jest.spyOn(textToSpeechProvider, 'createAudio')
    const saveFileSpy = jest.spyOn(storageProvider, 'saveFileFromBuffer')
    const deleteFileSpy = jest.spyOn(storageProvider, 'deleteFile')
    const saveSpy = jest.spyOn(cardsRepository, 'save')

    const deckId = '123456'
    const originalText = 'original text'

    jest
      .spyOn(cardsRepository, 'findByDeckIdAndOriginalText')
      .mockResolvedValue(undefined)
    jest
      .spyOn(cardsRepository, 'findById')
      .mockResolvedValue(
        CardMockBuilder.aCard()
          .withId('123456')
          .withDeckId(deckId)
          .withOriginalText(originalText)
          .build()
      )
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

    await expect(
      updateCardUseCase.execute({
        userId: '123456',
        cardId: '123456',
        originalText,
        translatedText: 'translated text'
      })
    ).resolves.toBeUndefined()
    expect(saveSpy).toHaveBeenCalled()
    expect(createAudioSpy).not.toHaveBeenCalled()
    expect(saveFileSpy).not.toHaveBeenCalled()
    expect(deleteFileSpy).not.toHaveBeenCalled()
  })
})
