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
  deckId: string
  userId: string
}

interface Response {
  cards: Card[]
}

export class ListAllDeckCardsUseCase implements UseCase<Request, Response> {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly decksRepository: DecksRepository,
    private readonly cardsRepository: CardsRepository
  ) {}

  async execute({ deckId, userId }: Request): Promise<Response> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      throw new UserNotFound()
    }

    const deck = await this.decksRepository.findById(deckId)

    if (!deck) {
      throw new DeckNotFound()
    }

    if (deck.userId !== userId) {
      throw new DeckDoesNotBelongToTheUser()
    }

    const cards = await this.cardsRepository.findByDeckId(deckId)

    return {
      cards
    }
  }
}
