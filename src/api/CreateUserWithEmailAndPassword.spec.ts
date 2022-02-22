import { User } from '@entities/User'
import { HashProvider } from '@providers/HashProvider/HashProvider.interface'
import { HashProviderStub } from '@providers/HashProvider/HashProviderStub'
import { UsersRepositoryStub } from '@repositories/stubs/UsersRepositoryStub'
import { UsersRepository } from '@repositories/UsersRepository'
import { CreateUserWithEmailAndPassword } from '@useCases/CreateUserWithEmailAndPassword'
import { Request } from 'express'
import { CreateUserWithEmailAndPasswordController } from './CreateUserWithEmailAndPassword'

describe('CreateUserWithEmailAndPassword', () => {
  let controller: CreateUserWithEmailAndPasswordController
  let useCase: CreateUserWithEmailAndPassword
  let hashProvider: HashProvider
  let usersRepository: UsersRepository

  beforeEach(() => {
    usersRepository = new UsersRepositoryStub()
    hashProvider = new HashProviderStub()
    useCase = new CreateUserWithEmailAndPassword(usersRepository, hashProvider)
    controller = new CreateUserWithEmailAndPasswordController(useCase)
  })

  it('should return 201 on success', async () => {
    const userId = '123123123'

    jest.spyOn(useCase, 'execute').mockResolvedValue(
      User.create(
        {
          name: 'Test User',
          email: 'testuser@email.com',
          password: '123456'
        },
        userId
      )
    )

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
