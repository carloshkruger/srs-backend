import { UsersRepositoryStub } from '@repositories/stubs/UsersRepositoryStub'
import { UsersRepository } from '@repositories/UsersRepository'
import { UpdateUserUseCase } from '@useCases/UpdateUserUseCase'
import { Request } from 'express'
import { UpdateUserController } from './UpdateUserController'

describe('UpdateUserController', () => {
  let controller: UpdateUserController
  let useCase: UpdateUserUseCase
  let usersRepository: UsersRepository

  beforeEach(() => {
    usersRepository = new UsersRepositoryStub()
    useCase = new UpdateUserUseCase(usersRepository)
    controller = new UpdateUserController(useCase)
  })

  it('should return 204 on success', async () => {
    jest.spyOn(useCase, 'execute').mockResolvedValue()

    const response = await controller.handle({
      body: {
        name: 'Test User',
        email: 'testuser@email.com'
      },
      user: {
        id: '123123'
      }
    } as unknown as Request)

    expect(response.statusCode).toBe(204)
    expect(response.body).toBeFalsy()
  })
})
