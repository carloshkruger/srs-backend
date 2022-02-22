import { UsersRepositoryStub } from '@repositories/stubs/UsersRepositoryStub'
import { UsersRepository } from '@repositories/UsersRepository'
import { UpdateUser } from '@useCases/UpdateUser'
import { Request } from 'express'
import { UpdateUserController } from './UpdateUser'

describe('UpdateUser', () => {
  let controller: UpdateUserController
  let useCase: UpdateUser
  let usersRepository: UsersRepository

  beforeEach(() => {
    usersRepository = new UsersRepositoryStub()
    useCase = new UpdateUser(usersRepository)
    controller = new UpdateUserController(useCase)
  })

  it('should return 204 on success', async () => {
    jest.spyOn(useCase, 'execute').mockResolvedValue()

    const response = await controller.handle({
      body: {
        name: 'Test User',
        email: 'testuser@email.com'
      },
      params: {
        id: '123123'
      }
    } as unknown as Request)

    expect(response.statusCode).toBe(204)
    expect(response.body).toBeFalsy()
  })
})
