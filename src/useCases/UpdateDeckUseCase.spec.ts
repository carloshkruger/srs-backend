import { DeckMockBuilder } from '@entities/mocks/DeckMockBuilder'
import { UserMockBuilder } from '@entities/mocks/UserMockBuilder'
import { DecksRepository } from '@repositories/DecksRepository'
import { DecksRepositoryStub } from '@repositories/stubs/DecksRepositoryStub'
import { UsersRepositoryStub } from '@repositories/stubs/UsersRepositoryStub'
import { UsersRepository } from '@repositories/UsersRepository'
import {
  DeckDoesNotBelongToTheUser,
  DeckNotFound,
  UserNotFound
} from './errors'
import { DeckNameAlreadyRegistered } from './errors/DeckNameAlreadyRegistered'
import { UpdateDeckUseCase } from './UpdateDeckUseCase'

describe('UpdateDeckUseCase', () => {
  let updateDeckUseCase: UpdateDeckUseCase
  let usersRepository: UsersRepository
  let decksRepository: DecksRepository

  beforeEach(() => {
    usersRepository = new UsersRepositoryStub()
    decksRepository = new DecksRepositoryStub()
    updateDeckUseCase = new UpdateDeckUseCase(usersRepository, decksRepository)
  })

  it('should throw if the user does not exists', async () => {
    jest.spyOn(usersRepository, 'findById').mockResolvedValue(undefined)

    await expect(
      updateDeckUseCase.execute({
        userId: '123456',
        deckId: '123456',
        name: 'Deck name',
        description: 'Deck description'
      })
    ).rejects.toThrow(UserNotFound)
  })

  it('should throw if the deck does not exists', async () => {
    jest
      .spyOn(usersRepository, 'findById')
      .mockResolvedValue(UserMockBuilder.aUser().build())
    jest.spyOn(decksRepository, 'findById').mockResolvedValue(undefined)

    await expect(
      updateDeckUseCase.execute({
        userId: '123456',
        deckId: '123456',
        name: 'Deck name',
        description: 'Deck description'
      })
    ).rejects.toThrow(DeckNotFound)
  })

  it('should throw if the deck does not belong to the user', async () => {
    jest
      .spyOn(usersRepository, 'findById')
      .mockResolvedValue(UserMockBuilder.aUser().build())
    jest
      .spyOn(decksRepository, 'findById')
      .mockResolvedValue(DeckMockBuilder.aDeck().build())

    await expect(
      updateDeckUseCase.execute({
        userId: 'different_user_id',
        deckId: '123456',
        name: 'Deck name',
        description: 'Deck description'
      })
    ).rejects.toThrow(DeckDoesNotBelongToTheUser)
  })

  it('should throw if the chosen name is already created for this user', async () => {
    const idFromAnotherDeckWithTheSameName = '12345678'
    const idFromDeckThatIsBeenUpdated = '12345'

    jest
      .spyOn(usersRepository, 'findById')
      .mockResolvedValue(UserMockBuilder.aUser().build())

    jest
      .spyOn(decksRepository, 'findById')
      .mockResolvedValue(
        DeckMockBuilder.aDeck().withId(idFromDeckThatIsBeenUpdated).build()
      )

    jest
      .spyOn(decksRepository, 'findByNameAndUserId')
      .mockResolvedValue(
        DeckMockBuilder.aDeck().withId(idFromAnotherDeckWithTheSameName).build()
      )

    await expect(
      updateDeckUseCase.execute({
        userId: '123456',
        deckId: idFromDeckThatIsBeenUpdated,
        name: 'Deck name',
        description: 'Deck description'
      })
    ).rejects.toThrow(DeckNameAlreadyRegistered)
  })

  it('should update a deck', async () => {
    const saveSpy = jest.spyOn(decksRepository, 'save')
    jest
      .spyOn(usersRepository, 'findById')
      .mockResolvedValue(UserMockBuilder.aUser().build())

    jest
      .spyOn(decksRepository, 'findById')
      .mockResolvedValue(DeckMockBuilder.aDeck().build())

    jest
      .spyOn(decksRepository, 'findByNameAndUserId')
      .mockResolvedValue(undefined)

    await expect(
      updateDeckUseCase.execute({
        userId: '123456',
        deckId: '123456',
        name: 'New deck name',
        description: 'New deck description'
      })
    ).resolves.toBeUndefined()

    expect(saveSpy).toHaveBeenCalled()
    const deckPassedToSaveMethod = saveSpy.mock.calls[0][0]
    expect(deckPassedToSaveMethod.name).toBe('New deck name')
    expect(deckPassedToSaveMethod.description).toBe('New deck description')
  })
})
