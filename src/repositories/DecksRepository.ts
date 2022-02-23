import { Deck } from '@entities/Deck'

export interface DecksRepository {
  findById(deckId: string): Promise<Deck>
  findByNameAndUserId(name: string, userId: string): Promise<Deck>
  save(deck: Deck): Promise<void>
}
