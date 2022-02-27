import { CardMockBuilder } from '@entities/mocks/CardMockBuilder'
import { DeckMockBuilder } from '@entities/mocks/DeckMockBuilder'
import { UserMockBuilder } from '@entities/mocks/UserMockBuilder'
import { CardsRepository } from '@repositories/CardsRepository'
import { DecksRepository } from '@repositories/DecksRepository'
import { CardsRepositoryStub } from '@repositories/stubs/CardsRepositoryStub'
import { DecksRepositoryStub } from '@repositories/stubs/DecksRepositoryStub'
import { UsersRepositoryStub } from '@repositories/stubs/UsersRepositoryStub'
import { UsersRepository } from '@repositories/UsersRepository'
import {
  DeckDoesNotBelongToTheUser,
  DeckNotFound,
  UserNotFound
} from './errors'
import { ListAllDeckCardsUseCase } from './ListAllDeckCardsUseCase'

describe('ListAllDeckCardsUseCase', () => {
  let useCase: ListAllDeckCardsUseCase
  let usersRepository: UsersRepository
  let decksRepository: DecksRepository
  let cardsRepository: CardsRepository

  beforeEach(() => {
    usersRepository = new UsersRepositoryStub()
    decksRepository = new DecksRepositoryStub()
    cardsRepository = new CardsRepositoryStub()
    useCase = new ListAllDeckCardsUseCase(
      usersRepository,
      decksRepository,
      cardsRepository
    )
  })

  it('should throw an error if the user was not found', async () => {
    jest.spyOn(usersRepository, 'findById').mockResolvedValue(undefined)
    const findByDeckIdSpy = jest.spyOn(cardsRepository, 'findByDeckId')

    await expect(
      useCase.execute({
        deckId: '123',
        userId: '123'
      })
    ).rejects.toThrow(UserNotFound)
    expect(findByDeckIdSpy).not.toHaveBeenCalled()
  })

  it('should throw if the deck does not exists', async () => {
    jest
      .spyOn(usersRepository, 'findById')
      .mockResolvedValue(UserMockBuilder.aUser().build())
    jest.spyOn(decksRepository, 'findById').mockResolvedValue(undefined)

    await expect(
      useCase.execute({
        deckId: '123',
        userId: '123'
      })
    ).rejects.toThrow(DeckNotFound)
  })

  it('should throw if the deck does not belong to the user', async () => {
    const userId = '12345'
    const differentUserId = 'different_user_id'

    jest
      .spyOn(usersRepository, 'findById')
      .mockResolvedValue(UserMockBuilder.aUser().withId(userId).build())
    jest
      .spyOn(decksRepository, 'findById')
      .mockResolvedValue(DeckMockBuilder.aDeck().withUserId(userId).build())

    await expect(
      useCase.execute({
        deckId: '123',
        userId: differentUserId
      })
    ).rejects.toThrow(DeckDoesNotBelongToTheUser)
  })

  it('should return a list of cards', async () => {
    const userId = '12345'

    jest
      .spyOn(usersRepository, 'findById')
      .mockResolvedValue(UserMockBuilder.aUser().withId(userId).build())
    jest
      .spyOn(decksRepository, 'findById')
      .mockResolvedValue(DeckMockBuilder.aDeck().withUserId(userId).build())
    jest
      .spyOn(cardsRepository, 'findByDeckId')
      .mockResolvedValue([CardMockBuilder.aCard().build()])

    await expect(
      useCase.execute({
        deckId: '123',
        userId
      })
    ).resolves.toMatchObject({
      cards: expect.any(Array)
    })
  })
})
