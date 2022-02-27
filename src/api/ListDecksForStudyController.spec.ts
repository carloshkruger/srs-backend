import { DecksRepository } from '@repositories/DecksRepository'
import { DecksRepositoryStub } from '@repositories/stubs/DecksRepositoryStub'
import { UsersRepositoryStub } from '@repositories/stubs/UsersRepositoryStub'
import { UsersRepository } from '@repositories/UsersRepository'
import { ListDecksForStudyUseCase } from '@useCases/ListDecksForStudyUseCase'
import { Request } from 'express'
import { ListDecksForStudyController } from './ListDecksForStudyController'

describe('ListDecksForStudyController', () => {
  let controller: ListDecksForStudyController
  let useCase: ListDecksForStudyUseCase
  let usersRepository: UsersRepository
  let decksRepository: DecksRepository

  beforeEach(() => {
    usersRepository = new UsersRepositoryStub()
    decksRepository = new DecksRepositoryStub()
    useCase = new ListDecksForStudyUseCase(usersRepository, decksRepository)
    controller = new ListDecksForStudyController(useCase)
  })

  it('should return 200 on success', async () => {
    const useCaseResult = {
      decks: [
        {
          deck: {
            id: '123',
            name: 'deck name',
            description: 'deck description'
          },
          cards: {
            totalQuantity: 10,
            availableForStudyQuantity: 1
          }
        }
      ]
    }
    jest.spyOn(useCase, 'execute').mockResolvedValue(useCaseResult)

    const response = await controller.handle({
      user: {
        id: '123'
      }
    } as Request)

    expect(response.statusCode).toBe(200)
    expect(response.body).toMatchObject(useCaseResult)
  })
})
