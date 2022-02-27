import { Deck } from '@entities/Deck'

export interface DecksRepository {
  findById(deckId: string): Promise<Deck>
  findByNameAndUserId(name: string, userId: string): Promise<Deck>
  save(deck: Deck): Promise<void>
  deleteById(deckId: string): Promise<void>
  findAllAndCardsQuantityByUserId(
    userId: string
  ): Promise<FindAllAndCardsQuantityByUserIdResponse[]>
}

export interface FindAllAndCardsQuantityByUserIdResponse {
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
