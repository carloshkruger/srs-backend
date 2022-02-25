import { StorageProvider } from '@providers/StorageProvider/StorageProvider.interface'
import { CardsRepository } from '@repositories/CardsRepository'
import { DecksRepository } from '@repositories/DecksRepository'
import { CardDoesNotBelongToTheUser, CardNotFound } from './errors'
import { UseCase } from './UseCase.interface'

interface Request {
  cardId: string
  userId: string
}

export class DeleteCardUseCase implements UseCase<Request, void> {
  constructor(
    private decksRepository: DecksRepository,
    private cardsRepository: CardsRepository,
    private storageProvider: StorageProvider
  ) {}

  async execute({ cardId, userId }: Request): Promise<void> {
    const card = await this.cardsRepository.findById(cardId)

    if (!card) {
      throw new CardNotFound()
    }

    const deck = await this.decksRepository.findById(card.deckId)

    if (deck.userId !== userId) {
      throw new CardDoesNotBelongToTheUser()
    }

    await this.cardsRepository.deleteById(cardId)
    await this.storageProvider.deleteFolder(card.getFilePathToStorage(userId))
  }
}
