import { Card } from '@entities/Card'
import { CardReviewDifficultyLevel } from '@entities/enums/CardReviewDifficultyLevel'
import { Deck } from '@entities/Deck'
import { User } from '@entities/User'
import { CardsRepository } from '@repositories/CardsRepository'
import { DecksRepository } from '@repositories/DecksRepository'
import { CardsRepositoryStub } from '@repositories/stubs/CardsRepositoryStub'
import { DecksRepositoryStub } from '@repositories/stubs/DecksRepositoryStub'
import { UsersRepositoryStub } from '@repositories/stubs/UsersRepositoryStub'
import { UsersRepository } from '@repositories/UsersRepository'
import { CreateCardReviewUseCase } from './CreateCardReviewUseCase'
import {
  CardDoesNotBelongToTheUser,
  CardNotFound,
  UserNotFound
} from './errors'

describe('CreateCardReviewUseCase', () => {
  let createCardReviewUseCase: CreateCardReviewUseCase
  let decksRepository: DecksRepository
  let cardsRepository: CardsRepository
  let usersRepository: UsersRepository

  beforeEach(() => {
    decksRepository = new DecksRepositoryStub()
    cardsRepository = new CardsRepositoryStub()
    usersRepository = new UsersRepositoryStub()
    createCardReviewUseCase = new CreateCardReviewUseCase(
      usersRepository,
      cardsRepository,
      decksRepository
    )
  })

  it('should throw if the user does not exists', async () => {
    const saveSpy = jest.spyOn(cardsRepository, 'save')

    jest.spyOn(usersRepository, 'findById').mockResolvedValue(undefined)

    await expect(
      createCardReviewUseCase.execute({
        cardId: '123',
        difficultyLevel: CardReviewDifficultyLevel.EASY,
        userId: '12345'
      })
    ).rejects.toThrow(UserNotFound)
    expect(saveSpy).not.toHaveBeenCalled()
  })

  it('should throw if the card does not exists', async () => {
    const saveSpy = jest.spyOn(cardsRepository, 'save')

    jest.spyOn(usersRepository, 'findById').mockResolvedValue(
      User.create({
        email: 'email@email.com',
        name: 'test user'
      })
    )
    jest.spyOn(cardsRepository, 'findById').mockResolvedValue(undefined)

    await expect(
      createCardReviewUseCase.execute({
        cardId: '123',
        difficultyLevel: CardReviewDifficultyLevel.EASY,
        userId: '12345'
      })
    ).rejects.toThrow(CardNotFound)
    expect(saveSpy).not.toHaveBeenCalled()
  })

  it('should throw if the card does not belong to the user', async () => {
    const deckId = '123456789'
    const userId = '12345'
    const differentUserId = '54321'

    const saveSpy = jest.spyOn(cardsRepository, 'save')

    jest.spyOn(usersRepository, 'findById').mockResolvedValue(
      User.create({
        email: 'email@email.com',
        name: 'test user'
      })
    )
    jest.spyOn(cardsRepository, 'findById').mockResolvedValue(
      Card.create({
        audioFileName: 'audio.mp3',
        cardReviews: [],
        deckId,
        originalText: 'original text',
        translatedText: 'translated text'
      })
    )
    jest.spyOn(decksRepository, 'findById').mockResolvedValue(
      Deck.create(
        {
          name: 'deck name',
          userId,
          description: 'description test'
        },
        deckId
      )
    )

    await expect(
      createCardReviewUseCase.execute({
        cardId: '123',
        difficultyLevel: CardReviewDifficultyLevel.EASY,
        userId: differentUserId
      })
    ).rejects.toThrow(CardDoesNotBelongToTheUser)
    expect(saveSpy).not.toHaveBeenCalled()
  })

  it('should save the card with the card review', async () => {
    const deckId = '123456789'
    const userId = '12345'

    const saveSpy = jest.spyOn(cardsRepository, 'save')

    jest.spyOn(usersRepository, 'findById').mockResolvedValue(
      User.create({
        email: 'email@email.com',
        name: 'test user'
      })
    )
    jest.spyOn(cardsRepository, 'findById').mockResolvedValue(
      Card.create({
        audioFileName: 'audio.mp3',
        cardReviews: [],
        deckId,
        originalText: 'original text',
        translatedText: 'translated text'
      })
    )
    jest.spyOn(decksRepository, 'findById').mockResolvedValue(
      Deck.create(
        {
          name: 'deck name',
          userId,
          description: 'description test'
        },
        deckId
      )
    )

    await expect(
      createCardReviewUseCase.execute({
        cardId: '123',
        difficultyLevel: CardReviewDifficultyLevel.EASY,
        userId
      })
    ).resolves.toMatchObject({
      nextReviewDate: expect.any(Date)
    })

    const cardPassedToSaveMethod = saveSpy.mock.calls[0][0]

    expect(saveSpy).toHaveBeenCalled()
    expect(cardPassedToSaveMethod.cardReviews).toHaveLength(1)
    expect(cardPassedToSaveMethod.nextReviewAt).toBeTruthy()
  })
})
