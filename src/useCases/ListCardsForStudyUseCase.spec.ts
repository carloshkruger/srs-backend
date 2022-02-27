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
import {
  ListCardsForStudyUseCase,
  MAX_NUMBER_OF_DAILY_REVIEWS_BY_USER
} from './ListCardsForStudyUseCase'

describe('ListCardsForStudyUseCase', () => {
  let useCase: ListCardsForStudyUseCase
  let usersRepository: UsersRepository
  let decksRepository: DecksRepository
  let cardsRepository: CardsRepository

  beforeEach(() => {
    usersRepository = new UsersRepositoryStub()
    decksRepository = new DecksRepositoryStub()
    cardsRepository = new CardsRepositoryStub()
    useCase = new ListCardsForStudyUseCase(
      usersRepository,
      decksRepository,
      cardsRepository
    )
  })

  it('should throw if the user does not exists', async () => {
    jest.spyOn(usersRepository, 'findById').mockResolvedValue(undefined)

    await expect(
      useCase.execute({
        userId: '123'
      })
    ).rejects.toThrow(UserNotFound)
  })

  it('should throw if the deck does not exists', async () => {
    jest
      .spyOn(usersRepository, 'findById')
      .mockResolvedValue(UserMockBuilder.aUser().build())

    jest.spyOn(decksRepository, 'findById').mockResolvedValue(undefined)

    await expect(
      useCase.execute({
        userId: '123',
        deckId: '123'
      })
    ).rejects.toThrow(DeckNotFound)
  })

  it('should throw if the deck does not belong to the user', async () => {
    const userId = '123'
    const differentUserId = '123456'

    jest
      .spyOn(usersRepository, 'findById')
      .mockResolvedValue(UserMockBuilder.aUser().build())

    jest
      .spyOn(decksRepository, 'findById')
      .mockResolvedValue(DeckMockBuilder.aDeck().withUserId(userId).build())

    await expect(
      useCase.execute({
        userId: differentUserId,
        deckId: '123'
      })
    ).rejects.toThrow(DeckDoesNotBelongToTheUser)
  })

  it('should return an empty list if there are not remaining reviews', async () => {
    const userId = '123'

    jest
      .spyOn(usersRepository, 'findById')
      .mockResolvedValue(UserMockBuilder.aUser().build())

    jest
      .spyOn(decksRepository, 'findById')
      .mockResolvedValue(DeckMockBuilder.aDeck().withUserId(userId).build())

    jest
      .spyOn(cardsRepository, 'countCardsReviewedTodayByUser')
      .mockResolvedValue(MAX_NUMBER_OF_DAILY_REVIEWS_BY_USER)

    await expect(
      useCase.execute({
        userId,
        deckId: '123'
      })
    ).resolves.toEqual({
      cards: []
    })
  })

  it('should return an list of cards', async () => {
    const userId = '123'
    const deckId = '12345'

    jest
      .spyOn(usersRepository, 'findById')
      .mockResolvedValue(UserMockBuilder.aUser().build())

    jest
      .spyOn(decksRepository, 'findById')
      .mockResolvedValue(DeckMockBuilder.aDeck().withUserId(userId).build())

    jest
      .spyOn(cardsRepository, 'countCardsReviewedTodayByUser')
      .mockResolvedValue(MAX_NUMBER_OF_DAILY_REVIEWS_BY_USER - 1)

    const findCardsSpy = jest
      .spyOn(cardsRepository, 'findCardsForReview')
      .mockResolvedValue([CardMockBuilder.aCard().build()])

    await expect(
      useCase.execute({
        userId,
        deckId
      })
    ).resolves.toEqual({
      cards: expect.any(Array)
    })
    expect(findCardsSpy).toHaveBeenCalledWith({
      userId,
      deckId,
      limit: expect.any(Number)
    })
  })

  it('should not validate deck if deckId is not informed', async () => {
    const userId = '123'

    jest
      .spyOn(usersRepository, 'findById')
      .mockResolvedValue(UserMockBuilder.aUser().build())
    const findDeckSpy = jest
      .spyOn(decksRepository, 'findById')
      .mockResolvedValue(DeckMockBuilder.aDeck().withUserId(userId).build())
    jest
      .spyOn(cardsRepository, 'countCardsReviewedTodayByUser')
      .mockResolvedValue(MAX_NUMBER_OF_DAILY_REVIEWS_BY_USER - 1)
    jest
      .spyOn(cardsRepository, 'findCardsForReview')
      .mockResolvedValue([CardMockBuilder.aCard().build()])

    await expect(
      useCase.execute({
        userId
      })
    ).resolves.not.toThrow()
    expect(findDeckSpy).not.toHaveBeenCalled()
  })
})
