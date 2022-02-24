import { Card } from '@entities/Card'
import { CardsRepository } from '@repositories/CardsRepository'
import { DecksRepository } from '@repositories/DecksRepository'
import { CardOriginalTextAlreadyCreated, DeckNotFound } from './errors'
import { UseCase } from './UseCase.interface'

interface Request {
  deckId: string
  originalText: string
  translatedText: string
}

export class CreateCardUseCase implements UseCase<Request, Card> {
  constructor(
    private decksRepository: DecksRepository,
    private cardsRepository: CardsRepository
  ) {}

  async execute({
    deckId,
    originalText,
    translatedText
  }: Request): Promise<Card> {
    const deck = await this.decksRepository.findById(deckId)

    if (!deck) {
      throw new DeckNotFound()
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
