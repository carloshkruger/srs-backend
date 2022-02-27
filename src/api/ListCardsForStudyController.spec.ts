import { CardMockBuilder } from '@entities/mocks/CardMockBuilder'
import { CardsRepository } from '@repositories/CardsRepository'
import { DecksRepository } from '@repositories/DecksRepository'
import { CardsRepositoryStub } from '@repositories/stubs/CardsRepositoryStub'
import { DecksRepositoryStub } from '@repositories/stubs/DecksRepositoryStub'
import { UsersRepositoryStub } from '@repositories/stubs/UsersRepositoryStub'
import { UsersRepository } from '@repositories/UsersRepository'
import { ListCardsForStudyUseCase } from '@useCases/ListCardsForStudyUseCase'
import { Request } from 'express'
import { ListCardsForStudyController } from './ListCardsForStudyController'

describe('ListCardsForStudyController', () => {
  let controller: ListCardsForStudyController
  let useCase: ListCardsForStudyUseCase
  let usersRepository: UsersRepository
  let decksRepository: DecksRepository
  let cardsRepository: CardsRepository

  beforeEach(() => {
    usersRepository = new UsersRepositoryStub()
    decksRepository = new DecksRepositoryStub()
    cardsRepository = new CardsRepositoryStub()
    useCase = new ListCardsForStudyUseCase(
      usersRepository,
      decksRepository,
      cardsRepository
    )
    controller = new ListCardsForStudyController(useCase)
  })

  it('should return 200 on success', async () => {
    const executeSpy = jest.spyOn(useCase, 'execute').mockResolvedValue({
      cards: [CardMockBuilder.aCard().build()]
    })

    const response = await controller.handle({
      user: {
        id: '123123'
      },
      query: {
        deckId: '12345'
      }
    } as unknown as Request)

    expect(response.statusCode).toBe(200)
    expect(response.body.cards).toHaveLength(1)
    expect(executeSpy).toHaveBeenCalledWith({
      userId: '123123',
      deckId: '12345'
    })
  })

  it('should pass undefined for deckId on execute method', async () => {
    const executeSpy = jest.spyOn(useCase, 'execute').mockResolvedValue({
      cards: [CardMockBuilder.aCard().build()]
    })

    const response = await controller.handle({
      user: {
        id: '123123'
      },
      query: {}
    } as unknown as Request)

    expect(response.statusCode).toBe(200)
    expect(response.body.cards).toHaveLength(1)
    expect(executeSpy).toHaveBeenCalledWith({
      userId: '123123',
      deckId: undefined
    })
  })
})
