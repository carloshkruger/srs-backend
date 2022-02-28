import { StorageProvider } from '@providers/StorageProvider/StorageProvider.interface'
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
  deckId: string
}

export class DeleteDeckUseCase implements UseCase<Request, void> {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly decksRepository: DecksRepository,
    private readonly storageProvider: StorageProvider
  ) {}

  async execute({ userId, deckId }: Request): Promise<void> {
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

    await this.decksRepository.deleteById(deckId)
    await this.storageProvider.deleteFolder([
      'users',
      deck.userId,
      'decks',
      deck.id
    ])
  }
}
