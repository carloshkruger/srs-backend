import { Deck } from '@entities/Deck'
import { DecksRepository } from '@repositories/DecksRepository'
import { DecksRepositoryStub } from '@repositories/stubs/DecksRepositoryStub'
import { UsersRepositoryStub } from '@repositories/stubs/UsersRepositoryStub'
import { UsersRepository } from '@repositories/UsersRepository'
import { CreateDeckUseCase } from '@useCases/CreateDeckUseCase'
import { Request } from 'express'
import { CreateDeckController } from './CreateDeckController'

describe('CreateDeckController', () => {
  let controller: CreateDeckController
  let useCase: CreateDeckUseCase
  let usersRepository: UsersRepository
  let decksRepository: DecksRepository

  beforeEach(() => {
    usersRepository = new UsersRepositoryStub()
    decksRepository = new DecksRepositoryStub()
    useCase = new CreateDeckUseCase(usersRepository, decksRepository)
    controller = new CreateDeckController(useCase)
  })

  it('should return 201 on success', async () => {
    jest.spyOn(useCase, 'execute').mockResolvedValue(
      Deck.create({
        userId: '123456',
        name: 'Deck name',
        description: 'Deck description'
      })
    )

    const response = await controller.handle({
      body: {
        name: 'Deck name',
        description: 'Deck description'
      },
      user: {
        id: '123456'
      }
    } as Request)

    expect(response.statusCode).toBe(201)
    expect(response.body).toMatchObject({
      id: expect.any(String),
      name: 'Deck name',
      description: 'Deck description'
    })
  })
})
