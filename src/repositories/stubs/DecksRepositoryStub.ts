import { Deck } from '@entities/Deck'
import {
  DecksRepository,
  FindAllAndCardsQuantityByUserIdResponse
} from '@repositories/DecksRepository'

export class DecksRepositoryStub implements DecksRepository {
  async findById(): Promise<Deck> {
    return Promise.resolve(undefined)
  }
  async findByNameAndUserId(): Promise<Deck> {
    return Promise.resolve(undefined)
  }
  async save(): Promise<void> {
    return Promise.resolve(undefined)
  }
  async deleteById(): Promise<void> {
    return Promise.resolve(undefined)
  }
  async findAllAndCardsQuantityByUserId(): Promise<
    FindAllAndCardsQuantityByUserIdResponse[]
  > {
    return Promise.resolve([])
  }
}
