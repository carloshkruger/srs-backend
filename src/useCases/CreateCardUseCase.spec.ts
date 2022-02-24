import { Card } from '@entities/Card'
import { Deck } from '@entities/Deck'
import { CardsRepository } from '@repositories/CardsRepository'
import { DecksRepository } from '@repositories/DecksRepository'
import { CardsRepositoryStub } from '@repositories/stubs/CardsRepositoryStub'
import { DecksRepositoryStub } from '@repositories/stubs/DecksRepositoryStub'
import { CreateCardUseCase } from './CreateCardUseCase'
import { CardOriginalTextAlreadyCreated, DeckNotFound } from './errors'

describe('CreateDeckUseCase', () => {
  let createCardUseCase: CreateCardUseCase
  let decksRepository: DecksRepository
  let cardsRepository: CardsRepository

  beforeEach(() => {
    decksRepository = new DecksRepositoryStub()
    cardsRepository = new CardsRepositoryStub()
    createCardUseCase = new CreateCardUseCase(decksRepository, cardsRepository)
  })

  it('should throw if deck does not exists', async () => {
    const saveSpy = jest.spyOn(cardsRepository, 'save')
    jest.spyOn(decksRepository, 'findById').mockResolvedValue(undefined)

    await expect(
      createCardUseCase.execute({
        deckId: 'id_that_does_not_exists',
        originalText: 'original text',
        translatedText: 'translated text'
      })
    ).rejects.toThrow(DeckNotFound)
    expect(saveSpy).not.toHaveBeenCalled()
  })

  it('should throw if the original text is already created for this deck', async () => {
    const saveSpy = jest.spyOn(cardsRepository, 'save')
    const deckId = '123456'
    const originalText = 'original text'

    jest.spyOn(decksRepository, 'findById').mockResolvedValue(
      Deck.create(
        {
          name: 'Deck name',
          userId: '123456',
          description: 'Deck description'
        },
        deckId
      )
    )

    jest
      .spyOn(cardsRepository, 'findByDeckIdAndOriginalText')
      .mockResolvedValue(
        Card.create({
          deckId,
          audioFileName: '',
          originalText,
          translatedText: 'translated text'
        })
      )

    await expect(
      createCardUseCase.execute({
        deckId,
        originalText,
        translatedText: 'translated text'
      })
    ).rejects.toThrow(CardOriginalTextAlreadyCreated)
    expect(saveSpy).not.toHaveBeenCalled()
  })

  it('should save the card', async () => {
    const saveSpy = jest.spyOn(cardsRepository, 'save')
    jest.spyOn(decksRepository, 'findById').mockResolvedValue(
      Deck.create({
        name: 'Deck name',
        userId: '123456',
        description: 'Deck description'
      })
    )

    await expect(
      createCardUseCase.execute({
        deckId: '123456',
        originalText: 'original text',
        translatedText: 'translated text'
      })
    ).resolves.toBeInstanceOf(Card)
    expect(saveSpy).toHaveBeenCalled()
  })
})
