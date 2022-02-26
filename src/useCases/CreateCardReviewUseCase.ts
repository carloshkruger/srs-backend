import { CardReview } from '@entities/CardReview'
import { CardReviewDifficultyLevel } from '@entities/enums/CardReviewDifficultyLevel'
import { CardsRepository } from '@repositories/CardsRepository'
import { DecksRepository } from '@repositories/DecksRepository'
import { UsersRepository } from '@repositories/UsersRepository'
import {
  CardDoesNotBelongToTheUser,
  CardNotFound,
  UserNotFound
} from './errors'
import { UseCase } from './UseCase.interface'

interface Request {
  userId: string
  cardId: string
  difficultyLevel: CardReviewDifficultyLevel
}

export class CreateCardReviewUseCase implements UseCase<Request, void> {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly cardsRepository: CardsRepository,
    private readonly decksRepository: DecksRepository
  ) {}

  async execute({ userId, cardId, difficultyLevel }: Request): Promise<void> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      throw new UserNotFound()
    }

    const card = await this.cardsRepository.findById(cardId)

    if (!card) {
      throw new CardNotFound()
    }

    const deck = await this.decksRepository.findById(card.deckId)

    if (deck.userId !== userId) {
      throw new CardDoesNotBelongToTheUser()
    }

    const cardReview = CardReview.create({
      cardId: card.id,
      createdAt: new Date(),
      difficultyLevel
    })

    card.addCardReview(cardReview)
    card.calculateAndUpdateNextReviewDate()

    await this.cardsRepository.save(card)
  }
}
