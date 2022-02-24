import { Card } from '@entities/Card'
import { CardsRepository } from '@repositories/CardsRepository'
import { DecksRepository } from '@repositories/DecksRepository'
import {
  CardOriginalTextAlreadyCreated,
  DeckNotFound,
  MaximumDailyCardsCreationReached
} from './errors'
import { UseCase } from './UseCase.interface'

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
    private cardsRepository: CardsRepository
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

    const card = Card.create({
      deckId,
      originalText,
      translatedText,
      audioFileName: ''
    })

    await this.cardsRepository.save(card)

    return card
  }
}
