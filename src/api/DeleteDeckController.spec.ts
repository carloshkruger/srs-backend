import { StorageProvider } from '@providers/StorageProvider/StorageProvider.interface'
import { StorageProviderStub } from '@providers/StorageProvider/StorageProviderStub'
import { DecksRepository } from '@repositories/DecksRepository'
import { DecksRepositoryStub } from '@repositories/stubs/DecksRepositoryStub'
import { UsersRepositoryStub } from '@repositories/stubs/UsersRepositoryStub'
import { UsersRepository } from '@repositories/UsersRepository'
import { DeleteDeckUseCase } from '@useCases/DeleteDeckUseCase'
import { Request } from 'express'
import { DeleteDeckController } from './DeleteDeckController'

describe('DeleteDeckController', () => {
  let controller: DeleteDeckController
  let useCase: DeleteDeckUseCase
  let usersRepository: UsersRepository
  let decksRepository: DecksRepository
  let storageProvider: StorageProvider

  beforeEach(() => {
    usersRepository = new UsersRepositoryStub()
    decksRepository = new DecksRepositoryStub()
    storageProvider = new StorageProviderStub()
    useCase = new DeleteDeckUseCase(
      usersRepository,
      decksRepository,
      storageProvider
    )
    controller = new DeleteDeckController(useCase)
  })

  it('should return 204 on success', async () => {
    jest.spyOn(useCase, 'execute').mockResolvedValue(undefined)

    const response = await controller.handle({
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
