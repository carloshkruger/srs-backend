import { Deck } from '@entities/Deck'

export interface DecksRepository {
  findByName(name: string): Promise<Deck>
  save(deck: Deck): Promise<void>
}
