import { HashProvider } from '@providers/HashProvider/HashProvider.interface'
import { HashProviderStub } from '@providers/HashProvider/HashProviderStub'
import { UsersRepositoryStub } from '@repositories/stubs/UsersRepositoryStub'
import { UsersRepository } from '@repositories/UsersRepository'
import { UpdatePasswordUseCase } from '@useCases/UpdatePasswordUseCase'
import { Request } from 'express'
import { UpdatePasswordController } from './UpdatePasswordController'

describe('UpdatePasswordController', () => {
  let controller: UpdatePasswordController
  let useCase: UpdatePasswordUseCase
  let hashProvider: HashProvider
  let usersRepository: UsersRepository

  beforeEach(() => {
    usersRepository = new UsersRepositoryStub()
    hashProvider = new HashProviderStub()
    useCase = new UpdatePasswordUseCase(usersRepository, hashProvider)
    controller = new UpdatePasswordController(useCase)
  })

  it('should return 204 on success', async () => {
    jest.spyOn(useCase, 'execute').mockResolvedValue(undefined)

    const response = await controller.handle({
      body: {
        currentPassword: '123456',
        newPassword: '654321'
      },
      user: {
        id: '123123123'
      }
    } as Request)

    expect(response.statusCode).toBe(204)
    expect(response.body).toBeUndefined()
  })
})
