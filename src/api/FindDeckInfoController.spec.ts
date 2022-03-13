import { DecksRepository } from '@repositories/DecksRepository'
import { DecksRepositoryStub } from '@repositories/stubs/DecksRepositoryStub'
import { FindDeckInfoUseCase } from '@useCases/FindDeckInfoUseCase'
import { Request } from 'express'
import { FindDeckInfoController } from './FindDeckInfoController'

describe('FindDeckInfoController', () => {
  let controller: FindDeckInfoController
  let useCase: FindDeckInfoUseCase
  let decksRepository: DecksRepository

  beforeEach(() => {
    decksRepository = new DecksRepositoryStub()
    useCase = new FindDeckInfoUseCase(decksRepository)
    controller = new FindDeckInfoController(useCase)
  })

  it('should return 200 on success', async () => {
    const userId = '123456'
    const useCaseResponse = {
      id: '123',
      description: '',
      name: 'deck name',
      userId,
      cards: {
        totalQuantity: 0,
        availableForStudyQuantity: 0
      }
    }
    jest.spyOn(useCase, 'execute').mockResolvedValue(useCaseResponse)

    const response = await controller.handle({
      user: {
        id: userId
      },
      params: {
        id: '123'
      }
    } as unknown as Request)

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual(useCaseResponse)
  })
})
