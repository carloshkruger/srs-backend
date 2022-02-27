import { CardMockBuilder } from '@entities/mocks/CardMockBuilder'
import { CardsRepository } from '@repositories/CardsRepository'
import { DecksRepository } from '@repositories/DecksRepository'
import { CardsRepositoryStub } from '@repositories/stubs/CardsRepositoryStub'
import { DecksRepositoryStub } from '@repositories/stubs/DecksRepositoryStub'
import { UsersRepositoryStub } from '@repositories/stubs/UsersRepositoryStub'
import { UsersRepository } from '@repositories/UsersRepository'
import { ListAllDeckCardsUseCase } from '@useCases/ListAllDeckCardsUseCase'
import { Request } from 'express'
import { ListAllDeckCardsController } from './ListAllDeckCardsController'

describe('ListAllDeckCardsController', () => {
  let controller: ListAllDeckCardsController
  let useCase: ListAllDeckCardsUseCase
  let usersRepository: UsersRepository
  let decksRepository: DecksRepository
  let cardsRepository: CardsRepository

  beforeEach(() => {
    usersRepository = new UsersRepositoryStub()
    decksRepository = new DecksRepositoryStub()
    cardsRepository = new CardsRepositoryStub()
    useCase = new ListAllDeckCardsUseCase(
      usersRepository,
      decksRepository,
      cardsRepository
    )
    controller = new ListAllDeckCardsController(useCase)
  })

  it('should return 200 on success', async () => {
    jest.spyOn(useCase, 'execute').mockResolvedValue({
      cards: [CardMockBuilder.aCard().build()]
    })

    const response = await controller.handle({
      user: {
        id: '123123'
      },
      params: {
        id: '12345'
      }
    } as unknown as Request)

    expect(response.statusCode).toBe(200)
    expect(response.body.cards).toHaveLength(1)
  })
})
