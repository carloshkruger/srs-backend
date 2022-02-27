import { DecksRepository } from '@repositories/DecksRepository'
import { UsersRepository } from '@repositories/UsersRepository'
import { UserNotFound } from './errors'
import { UseCase } from './UseCase.interface'

interface Request {
  userId: string
}

interface DeckResponse {
  deck: {
    id: string
    name: string
    description: string
  }
  cards: {
    totalQuantity: number
    availableForStudyQuantity: number
  }
}

interface Response {
  decks: DeckResponse[]
}

export class ListDecksForStudyUseCase implements UseCase<Request, Response> {
  constructor(
    private usersRepository: UsersRepository,
    private decksRepository: DecksRepository
  ) {}

  async execute({ userId }: Request): Promise<Response> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      throw new UserNotFound()
    }

    const decks = await this.decksRepository.findAllAndCardsQuantityByUserId(
      userId
    )

    return {
      decks
    }
  }
}
