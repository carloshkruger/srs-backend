import { Deck } from '@entities/Deck'

export interface DecksRepository {
  findById(deckId: string): Promise<Deck>
  findByNameAndUserId(name: string, userId: string): Promise<Deck>
  save(deck: Deck): Promise<void>
  deleteById(deckId: string): Promise<void>
  findDeckInfo(id: string): Promise<DeckInfoResponse>
  findAllAndCardsQuantityByUserId(
    userId: string
  ): Promise<FindAllAndCardsQuantityByUserIdResponse[]>
}

export interface DeckInfoResponse {
  id: string
  name: string
  description: string
  userId: string
  cards: {
    totalQuantity: number
    availableForStudyQuantity: number
  }
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
