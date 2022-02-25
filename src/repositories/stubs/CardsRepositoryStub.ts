import { Card } from '@entities/Card'
import { CardsRepository } from '@repositories/CardsRepository'

export class CardsRepositoryStub implements CardsRepository {
  async save(): Promise<void> {
    return Promise.resolve(undefined)
  }
  async findById(): Promise<Card> {
    return Promise.resolve(undefined)
  }
  async findByDeckIdAndOriginalText(): Promise<Card> {
    return Promise.resolve(undefined)
  }
  async countCardsCreatedTodayByUser(): Promise<number> {
    return Promise.resolve(0)
  }
}
