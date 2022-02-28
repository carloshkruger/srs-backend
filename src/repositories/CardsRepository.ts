import { Card } from '@entities/Card'

export interface CardsRepository {
  save(card: Card): Promise<void>
  findById(id: string): Promise<Card>
  findByDeckId(deckId: string): Promise<Card[]>
  findByDeckIdAndOriginalText(
    deckId: string,
    originalText: string
  ): Promise<Card>
  countCardsCreatedTodayByUser(userId: string): Promise<number>
  deleteById(id: string): Promise<void>
  countCardsReviewedTodayByUser(userId: string): Promise<number>
  findCardsForReview(data: FindCardsForReviewParams): Promise<Card[]>
}

export type FindCardsForReviewParams = {
  userId: string
  limit: number
  deckId?: string
}
