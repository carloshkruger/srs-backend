import { Card } from '@entities/Card'

export interface CardsRepository {
  save(card: Card): Promise<void>
  findById(id: string): Promise<Card>
  findByDeckIdAndOriginalText(
    deckId: string,
    originalText: string
  ): Promise<Card>
  countCardsCreatedTodayByUser(userId: string): Promise<number>
}
