import { DecksRepository } from '@repositories/DecksRepository'
import { DeckDoesNotBelongToTheUser, DeckNotFound } from './errors'
import { UseCase } from './UseCase.interface'

interface Request {
  userId: string
  id: string
}

export interface Response {
  id: string
  name: string
  description: string
  userId: string
  cards: {
    totalQuantity: number
    availableForStudyQuantity: number
  }
}

export class FindDeckInfoUseCase implements UseCase<Request, Response> {
  constructor(private readonly decksRepository: DecksRepository) {}

  async execute({ userId, id }: Request): Promise<Response> {
    const deckInfo = await this.decksRepository.findDeckInfo(id)

    if (!deckInfo) {
      throw new DeckNotFound()
    }

    if (deckInfo.userId !== userId) {
      throw new DeckDoesNotBelongToTheUser()
    }

    return deckInfo
  }
}
