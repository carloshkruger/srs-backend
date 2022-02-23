import { Deck } from '@entities/Deck'

export interface DecksRepository {
  findByNameAndUserId(name: string, userId: string): Promise<Deck>
  save(deck: Deck): Promise<void>
}
