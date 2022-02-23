import { DecksRepository } from '@repositories/DecksRepository'
import { DecksRepositoryStub } from '@repositories/stubs/DecksRepositoryStub'
import { UsersRepositoryStub } from '@repositories/stubs/UsersRepositoryStub'
import { UsersRepository } from '@repositories/UsersRepository'
import { UpdateDeckUseCase } from '@useCases/UpdateDeckUseCase'
import { Request } from 'express'
import { UpdateDeckController } from './UpdateDeckController'

describe('CreateDeckController', () => {
  let controller: UpdateDeckController
  let useCase: UpdateDeckUseCase
  let usersRepository: UsersRepository
  let decksRepository: DecksRepository

  beforeEach(() => {
    usersRepository = new UsersRepositoryStub()
    decksRepository = new DecksRepositoryStub()
    useCase = new UpdateDeckUseCase(usersRepository, decksRepository)
    controller = new UpdateDeckController(useCase)
  })

  it('should return 204 on success', async () => {
    jest.spyOn(useCase, 'execute').mockResolvedValue(undefined)

    const response = await controller.handle({
      body: {
        name: 'Deck name',
        description: 'Deck description'
      },
      user: {
        id: '123456'
      },
      params: {
        id: '123456'
      }
    } as unknown as Request)

    expect(response.statusCode).toBe(204)
    expect(response.body).toBeUndefined()
  })
})
