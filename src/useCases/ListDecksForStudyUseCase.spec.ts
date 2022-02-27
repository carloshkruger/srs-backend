import { UserMockBuilder } from '@entities/mocks/UserMockBuilder'
import { DecksRepository } from '@repositories/DecksRepository'
import { DecksRepositoryStub } from '@repositories/stubs/DecksRepositoryStub'
import { UsersRepositoryStub } from '@repositories/stubs/UsersRepositoryStub'
import { UsersRepository } from '@repositories/UsersRepository'
import { UserNotFound } from './errors'
import { ListDecksForStudyUseCase } from './ListDecksForStudyUseCase'

describe('ListDecksForStudyUseCase', () => {
  let useCase: ListDecksForStudyUseCase
  let usersRepository: UsersRepository
  let decksRepository: DecksRepository

  beforeEach(() => {
    usersRepository = new UsersRepositoryStub()
    decksRepository = new DecksRepositoryStub()
    useCase = new ListDecksForStudyUseCase(usersRepository, decksRepository)
  })

  it('should throw if the user does not exists', async () => {
    jest.spyOn(usersRepository, 'findById').mockResolvedValue(undefined)

    await expect(
      useCase.execute({
        userId: '123456'
      })
    ).rejects.toThrow(UserNotFound)
  })

  it('should return a list of decks', async () => {
    jest
      .spyOn(usersRepository, 'findById')
      .mockResolvedValue(UserMockBuilder.aUser().build())

    const repositoryResult = [
      {
        deck: {
          id: '123',
          name: 'deck name',
          description: 'description'
        },
        cards: {
          totalQuantity: 10,
          availableForStudyQuantity: 1
        }
      }
    ]

    jest
      .spyOn(decksRepository, 'findAllAndCardsQuantityByUserId')
      .mockResolvedValue(repositoryResult)

    await expect(
      useCase.execute({
        userId: '123456'
      })
    ).resolves.toMatchObject({ decks: repositoryResult })
  })
})
