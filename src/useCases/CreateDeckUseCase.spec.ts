import { Deck } from '@entities/Deck'
import { UserMockBuilder } from '@entities/mocks/UserMockBuilder'
import { DecksRepository } from '@repositories/DecksRepository'
import { DecksRepositoryStub } from '@repositories/stubs/DecksRepositoryStub'
import { UsersRepositoryStub } from '@repositories/stubs/UsersRepositoryStub'
import { UsersRepository } from '@repositories/UsersRepository'
import { CreateDeckUseCase } from './CreateDeckUseCase'
import { UserNotFound } from './errors'
import { DeckNameAlreadyRegistered } from './errors/DeckNameAlreadyRegistered'

describe('CreateDeckUseCase', () => {
  let createDeckUseCase: CreateDeckUseCase
  let usersRepository: UsersRepository
  let decksRepository: DecksRepository

  beforeEach(() => {
    usersRepository = new UsersRepositoryStub()
    decksRepository = new DecksRepositoryStub()
    createDeckUseCase = new CreateDeckUseCase(usersRepository, decksRepository)
  })

  it('should throw if the user does not exists', async () => {
    jest.spyOn(usersRepository, 'findById').mockResolvedValue(undefined)

    await expect(
      createDeckUseCase.execute({
        userId: '123456',
        name: 'Deck name',
        description: 'Deck description'
      })
    ).rejects.toThrow(UserNotFound)
  })

  it('should throw if the chosen name is already created for this user', async () => {
    jest
      .spyOn(usersRepository, 'findById')
      .mockResolvedValue(UserMockBuilder.aUser().build())

    jest.spyOn(decksRepository, 'findByNameAndUserId').mockResolvedValue(
      Deck.create({
        userId: '123456',
        name: 'Deck name',
        description: 'Deck description'
      })
    )

    await expect(
      createDeckUseCase.execute({
        userId: '123456',
        name: 'Deck name',
        description: 'Deck description'
      })
    ).rejects.toThrow(DeckNameAlreadyRegistered)
  })

  it('should save a deck', async () => {
    const saveSpy = jest.spyOn(decksRepository, 'save')
    jest
      .spyOn(usersRepository, 'findById')
      .mockResolvedValue(UserMockBuilder.aUser().build())
    jest
      .spyOn(decksRepository, 'findByNameAndUserId')
      .mockResolvedValue(undefined)

    await expect(
      createDeckUseCase.execute({
        userId: '123456',
        name: 'Deck name',
        description: 'Deck description'
      })
    ).resolves.toBeInstanceOf(Deck)

    expect(saveSpy).toHaveBeenCalled()
  })
})
