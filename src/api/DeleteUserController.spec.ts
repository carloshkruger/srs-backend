import { UsersRepositoryStub } from '@repositories/stubs/UsersRepositoryStub'
import { UsersRepository } from '@repositories/UsersRepository'
import { DeleteUserUseCase } from '@useCases/DeleteUserUseCase'
import { Request } from 'express'
import { DeleteUserController } from './DeleteUserController'

describe('DeleteUserController', () => {
  let controller: DeleteUserController
  let useCase: DeleteUserUseCase
  let usersRepository: UsersRepository

  beforeEach(() => {
    usersRepository = new UsersRepositoryStub()
    useCase = new DeleteUserUseCase(usersRepository)
    controller = new DeleteUserController(useCase)
  })

  it('should return 204 on success', async () => {
    jest.spyOn(useCase, 'execute').mockResolvedValue()

    const response = await controller.handle({
      user: {
        id: '123123'
      }
    } as Request)

    expect(response.statusCode).toBe(204)
    expect(response.body).toBeFalsy()
  })
})
