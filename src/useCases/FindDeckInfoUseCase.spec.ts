import { DecksRepository } from '@repositories/DecksRepository'
import { DecksRepositoryStub } from '@repositories/stubs/DecksRepositoryStub'
import { DeckDoesNotBelongToTheUser, DeckNotFound } from './errors'
import { FindDeckInfoUseCase } from './FindDeckInfoUseCase'

describe('FindDeckInfoUseCase', () => {
  let decksRepository: DecksRepository
  let findDeckInfoUseCase: FindDeckInfoUseCase

  beforeEach(() => {
    decksRepository = new DecksRepositoryStub()
    findDeckInfoUseCase = new FindDeckInfoUseCase(decksRepository)
  })

  it('should throw if the deck does not exists', async () => {
    jest.spyOn(decksRepository, 'findDeckInfo').mockResolvedValue(undefined)

    await expect(
      findDeckInfoUseCase.execute({
        userId: '123456',
        id: '123456'
      })
    ).rejects.toThrow(DeckNotFound)
  })

  it('should throw if the deck does not belong to the user', async () => {
    const userId = '123456'
    const anotherUserId = '123123123'

    jest.spyOn(decksRepository, 'findDeckInfo').mockResolvedValue({
      id: '123',
      description: '',
      name: 'deck name',
      userId,
      cards: {
        totalQuantity: 0,
        availableForStudyQuantity: 0
      }
    })

    await expect(
      findDeckInfoUseCase.execute({
        userId: anotherUserId,
        id: '123456'
      })
    ).rejects.toThrow(DeckDoesNotBelongToTheUser)
  })

  it('should return deck info', async () => {
    const userId = '123456'
    const response = {
      id: '123',
      description: '',
      name: 'deck name',
      userId,
      cards: {
        totalQuantity: 0,
        availableForStudyQuantity: 0
      }
    }

    jest.spyOn(decksRepository, 'findDeckInfo').mockResolvedValue(response)

    await expect(
      findDeckInfoUseCase.execute({
        userId,
        id: '123456'
      })
    ).resolves.toEqual(response)
  })
})
