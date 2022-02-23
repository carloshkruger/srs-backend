import { DecksRepository } from '@repositories/DecksRepository'
import { UsersRepository } from '@repositories/UsersRepository'
import {
  DeckDoesNotBelongToTheUser,
  DeckNotFound,
  UserNotFound
} from './errors'
import { DeckNameAlreadyRegistered } from './errors/DeckNameAlreadyRegistered'
import { UseCase } from './UseCase.interface'

interface Request {
  userId: string
  deckId: string
  name: string
  description: string
}

export class UpdateDeckUseCase implements UseCase<Request, void> {
  constructor(
    private usersRepository: UsersRepository,
    private decksRepository: DecksRepository
  ) {}

  async execute({ userId, deckId, name, description }: Request): Promise<void> {
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

    const deckById = await this.decksRepository.findByNameAndUserId(
      name,
      userId
    )

    if (deckById && deckById.id !== deckId) {
      throw new DeckNameAlreadyRegistered(name)
    }

    deck.updateName(name)
    deck.updateDescription(description)

    await this.decksRepository.save(deck)
  }
}
