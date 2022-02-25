import { StorageProvider } from '@providers/StorageProvider/StorageProvider.interface'
import { StorageProviderStub } from '@providers/StorageProvider/StorageProviderStub'
import { CardsRepository } from '@repositories/CardsRepository'
import { DecksRepository } from '@repositories/DecksRepository'
import { CardsRepositoryStub } from '@repositories/stubs/CardsRepositoryStub'
import { DecksRepositoryStub } from '@repositories/stubs/DecksRepositoryStub'
import { DeleteCardUseCase } from '@useCases/DeleteCardUseCase'
import { Request } from 'express'
import { DeleteCardController } from './DeleteCardController'

describe('DeleteCardController', () => {
  let controller: DeleteCardController
  let useCase: DeleteCardUseCase
  let decksRepository: DecksRepository
  let cardsRepository: CardsRepository
  let storageProvider: StorageProvider

  beforeEach(() => {
    decksRepository = new DecksRepositoryStub()
    cardsRepository = new CardsRepositoryStub()
    storageProvider = new StorageProviderStub()
    useCase = new DeleteCardUseCase(
      decksRepository,
      cardsRepository,
      storageProvider
    )
    controller = new DeleteCardController(useCase)
  })

  it('should return 204 on success', async () => {
    jest.spyOn(useCase, 'execute').mockResolvedValue(undefined)

    const response = await controller.handle({
      user: {
        id: '123456'
      },
      params: {
        cardId: '123456'
      }
    } as unknown as Request)

    expect(response.statusCode).toBe(204)
    expect(response.body).toBeUndefined()
  })
})
