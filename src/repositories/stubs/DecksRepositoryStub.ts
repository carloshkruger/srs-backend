import { Deck } from '@entities/Deck'
import { DecksRepository } from '@repositories/DecksRepository'

export class DecksRepositoryStub implements DecksRepository {
  async findByName(): Promise<Deck> {
    return Promise.resolve(undefined)
  }
  async save(): Promise<void> {
    return Promise.resolve(undefined)
  }
}
