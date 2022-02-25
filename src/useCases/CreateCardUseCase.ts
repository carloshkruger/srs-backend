import { randomUUID } from 'crypto'
import { Card } from '@entities/Card'
import { TextToSpeechProvider } from '@providers/TextToSpeechProvider/TextToSpeechProvider.interface'
import { CardsRepository } from '@repositories/CardsRepository'
import { DecksRepository } from '@repositories/DecksRepository'
import {
  CardOriginalTextAlreadyCreated,
  DeckNotFound,
  MaximumDailyCardsCreationReached
} from './errors'
import { UseCase } from './UseCase.interface'
import { StorageProvider } from '@providers/StorageProvider/StorageProvider.interface'

interface Request {
  userId: string
  deckId: string
  originalText: string
  translatedText: string
}

export const MAXIMUM_DAILY_CARDS_CREATION_PER_USER = 15

export class CreateCardUseCase implements UseCase<Request, Card> {
  constructor(
    private decksRepository: DecksRepository,
    private cardsRepository: CardsRepository,
    private textToSpeechProvider: TextToSpeechProvider,
    private storageProvider: StorageProvider
  ) {}

  async execute({
    userId,
    deckId,
    originalText,
    translatedText
  }: Request): Promise<Card> {
    const deck = await this.decksRepository.findById(deckId)

    if (!deck) {
      throw new DeckNotFound()
    }

    const countCardsCreationToday =
      await this.cardsRepository.countCardsCreatedTodayByUser(userId)

    if (countCardsCreationToday >= MAXIMUM_DAILY_CARDS_CREATION_PER_USER) {
      throw new MaximumDailyCardsCreationReached()
    }

    const cardByOriginalText =
      await this.cardsRepository.findByDeckIdAndOriginalText(
        deckId,
        originalText
      )

    if (cardByOriginalText) {
      throw new CardOriginalTextAlreadyCreated()
    }

    const audioFileName = `${randomUUID()}.mp3`

    const card = Card.create({
      deckId,
      originalText,
      translatedText,
      audioFileName
    })

    const audioBuffer = await this.textToSpeechProvider.createAudio(
      originalText
    )

    const filePath = card.getFilePathToStorage(userId)

    await this.storageProvider.saveFileFromBuffer({
      fileName: audioFileName,
      bufferContent: audioBuffer,
      filePath
    })

    try {
      await this.cardsRepository.save(card)
    } catch (error) {
      await this.storageProvider.deleteFile({
        fileName: audioFileName,
        filePath
      })

      throw error
    }

    return card
  }
}
