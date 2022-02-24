import { Card } from '@entities/Card'
import { CardsRepository } from '@repositories/CardsRepository'
import { DecksRepository } from '@repositories/DecksRepository'
import { CardsRepositoryStub } from '@repositories/stubs/CardsRepositoryStub'
import { DecksRepositoryStub } from '@repositories/stubs/DecksRepositoryStub'
import { CreateCardUseCase } from '@useCases/CreateCardUseCase'
import { Request } from 'express'
import { CreateCardController } from './CreateCardController'

describe('CreateCardController', () => {
  let controller: CreateCardController
  let useCase: CreateCardUseCase
  let decksRepository: DecksRepository
  let cardsRepository: CardsRepository

  beforeEach(() => {
    decksRepository = new DecksRepositoryStub()
    cardsRepository = new CardsRepositoryStub()
    useCase = new CreateCardUseCase(decksRepository, cardsRepository)
    controller = new CreateCardController(useCase)
  })

  it('should return 201 on success', async () => {
    jest.spyOn(useCase, 'execute').mockResolvedValue(
      Card.create({
        deckId: '123456',
        audioFileName: '',
        originalText: 'original text',
        translatedText: 'translated text'
      })
    )

    const response = await controller.handle({
      body: {
        deckId: '123456',
        originalText: 'original text',
        translatedText: 'translated text'
      }
    } as Request)

    expect(response.statusCode).toBe(201)
    expect(response.body).toMatchObject({
      id: expect.any(String),
      deckId: '123456',
      originalText: 'original text',
      translatedText: 'translated text'
    })
  })
})
