import { Deck } from '@entities/Deck'
import { DecksRepository } from '@repositories/DecksRepository'
import { UsersRepository } from '@repositories/UsersRepository'
import { UserNotFound } from './errors'
import { DeckNameAlreadyRegistered } from './errors/DeckNameAlreadyRegistered'
import { UseCase } from './UseCase.interface'

interface Request {
  userId: string
  name: string
  description?: string
}

export class CreateDeckUseCase implements UseCase<Request, Deck> {
  constructor(
    private usersRepository: UsersRepository,
    private decksRepository: DecksRepository
  ) {}

  async execute({ userId, name, description }: Request): Promise<Deck> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      throw new UserNotFound()
    }

    const deckByName = await this.decksRepository.findByNameAndUserId(
      name,
      userId
    )

    if (deckByName) {
      throw new DeckNameAlreadyRegistered(name)
    }

    const deck = Deck.create({
      userId,
      name,
      description
    })

    await this.decksRepository.save(deck)

    return deck
  }
}
