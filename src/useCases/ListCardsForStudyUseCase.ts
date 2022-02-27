import { Card } from '@entities/Card'
import { CardsRepository } from '@repositories/CardsRepository'
import { DecksRepository } from '@repositories/DecksRepository'
import { UsersRepository } from '@repositories/UsersRepository'
import {
  DeckDoesNotBelongToTheUser,
  DeckNotFound,
  UserNotFound
} from './errors'
import { UseCase } from './UseCase.interface'

interface Request {
  userId: string
  deckId?: string
}

interface Response {
  cards: Card[]
}

export const MAX_NUMBER_OF_DAILY_REVIEWS_BY_USER = 100

export class ListCardsForStudyUseCase implements UseCase<Request, Response> {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly decksRepository: DecksRepository,
    private readonly cardsRepository: CardsRepository
  ) {}

  async execute({ userId, deckId }: Request): Promise<Response> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      throw new UserNotFound()
    }

    if (deckId) {
      const deck = await this.decksRepository.findById(deckId)

      if (!deck) {
        throw new DeckNotFound()
      }

      if (deck.userId !== userId) {
        throw new DeckDoesNotBelongToTheUser()
      }
    }

    const cardsReviewedTodayByUser =
      await this.cardsRepository.countCardsReviewedTodayByUser(userId)

    const remainingReviews =
      MAX_NUMBER_OF_DAILY_REVIEWS_BY_USER - cardsReviewedTodayByUser

    if (remainingReviews <= 0) {
      return {
        cards: []
      }
    }

    const cards = await this.cardsRepository.findCardsForReview({
      userId,
      deckId,
      limit: remainingReviews
    })

    return {
      cards
    }
  }
}
