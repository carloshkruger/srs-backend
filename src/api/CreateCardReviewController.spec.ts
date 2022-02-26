import { CardReviewDifficultyLevel } from '@entities/enums/CardReviewDifficultyLevel'
import { CardsRepository } from '@repositories/CardsRepository'
import { DecksRepository } from '@repositories/DecksRepository'
import { CardsRepositoryStub } from '@repositories/stubs/CardsRepositoryStub'
import { DecksRepositoryStub } from '@repositories/stubs/DecksRepositoryStub'
import { UsersRepositoryStub } from '@repositories/stubs/UsersRepositoryStub'
import { UsersRepository } from '@repositories/UsersRepository'
import { CreateCardReviewUseCase } from '@useCases/CreateCardReviewUseCase'
import { Request } from 'express'
import { CreateCardReviewController } from './CreateCardReviewController'

describe('CreateCardReviewController', () => {
  let controller: CreateCardReviewController
  let useCase: CreateCardReviewUseCase
  let usersRepository: UsersRepository
  let decksRepository: DecksRepository
  let cardsRepository: CardsRepository

  beforeEach(() => {
    usersRepository = new UsersRepositoryStub()
    decksRepository = new DecksRepositoryStub()
    cardsRepository = new CardsRepositoryStub()
    useCase = new CreateCardReviewUseCase(
      usersRepository,
      cardsRepository,
      decksRepository
    )
    controller = new CreateCardReviewController(useCase)
  })

  it('should return 204 on success', async () => {
    jest.spyOn(useCase, 'execute').mockResolvedValue(undefined)

    const response = await controller.handle({
      body: {
        difficultyLevel: CardReviewDifficultyLevel.EASY
      },
      user: {
        id: '123456'
      },
      params: {
        id: '1234'
      }
    } as unknown as Request)

    expect(response.statusCode).toBe(204)
    expect(response.body).toBeUndefined()
  })
})
