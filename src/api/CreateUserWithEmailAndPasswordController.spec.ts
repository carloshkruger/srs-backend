import { UserMockBuilder } from '@entities/mocks/UserMockBuilder'
import { HashProvider } from '@providers/HashProvider/HashProvider.interface'
import { HashProviderStub } from '@providers/HashProvider/HashProviderStub'
import { UsersRepositoryStub } from '@repositories/stubs/UsersRepositoryStub'
import { UsersRepository } from '@repositories/UsersRepository'
import { CreateUserWithEmailAndPasswordUseCase } from '@useCases/CreateUserWithEmailAndPasswordUseCase'
import { Request } from 'express'
import { CreateUserWithEmailAndPasswordController } from './CreateUserWithEmailAndPasswordController'

describe('CreateUserWithEmailAndPasswordController', () => {
  let controller: CreateUserWithEmailAndPasswordController
  let useCase: CreateUserWithEmailAndPasswordUseCase
  let hashProvider: HashProvider
  let usersRepository: UsersRepository

  beforeEach(() => {
    usersRepository = new UsersRepositoryStub()
    hashProvider = new HashProviderStub()
    useCase = new CreateUserWithEmailAndPasswordUseCase(
      usersRepository,
      hashProvider
    )
    controller = new CreateUserWithEmailAndPasswordController(useCase)
  })

  it('should return 201 on success', async () => {
    const userId = '123123123'

    jest
      .spyOn(useCase, 'execute')
      .mockResolvedValue(UserMockBuilder.aUser().withId(userId).build())

    const response = await controller.handle({
      body: {
        name: 'Test User',
        email: 'testuser@email.com',
        password: '123456'
      }
    } as Request)

    expect(response.statusCode).toBe(201)
    expect(response.body.id).toBe(userId)
  })
})
