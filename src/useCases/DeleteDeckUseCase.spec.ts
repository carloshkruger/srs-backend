import { Deck } from '@entities/Deck'
import { User } from '@entities/User'
import { DecksRepository } from '@repositories/DecksRepository'
import { DecksRepositoryStub } from '@repositories/stubs/DecksRepositoryStub'
import { UsersRepositoryStub } from '@repositories/stubs/UsersRepositoryStub'
import { UsersRepository } from '@repositories/UsersRepository'
import { DeleteDeckUseCase } from './DeleteDeckUseCase'
import {
  DeckDoesNotBelongToTheUser,
  DeckNotFound,
  UserNotFound
} from './errors'

describe('DeleteDeckUseCase', () => {
  let deleteDeckUseCase: DeleteDeckUseCase
  let usersRepository: UsersRepository
  let decksRepository: DecksRepository

  beforeEach(() => {
    usersRepository = new UsersRepositoryStub()
    decksRepository = new DecksRepositoryStub()
    deleteDeckUseCase = new DeleteDeckUseCase(usersRepository, decksRepository)
  })

  it('should throw if the user does not exists', async () => {
    jest.spyOn(usersRepository, 'findById').mockResolvedValue(undefined)

    await expect(
      deleteDeckUseCase.execute({
        userId: '123456',
        deckId: '123456'
      })
    ).rejects.toThrow(UserNotFound)
  })

  it('should throw if the deck does not exists', async () => {
    jest.spyOn(usersRepository, 'findById').mockResolvedValue(
      User.create({
        name: 'Test User',
        email: 'testuser@email.com',
        password: '123456'
      })
    )
    jest.spyOn(decksRepository, 'findById').mockResolvedValue(undefined)

    await expect(
      deleteDeckUseCase.execute({
        userId: '123456',
        deckId: '123456'
      })
    ).rejects.toThrow(DeckNotFound)
  })

  it('should throw if the deck does not belong to the user', async () => {
    jest.spyOn(usersRepository, 'findById').mockResolvedValue(
      User.create({
        name: 'Test User',
        email: 'testuser@email.com',
        password: '123456'
      })
    )
    jest.spyOn(decksRepository, 'findById').mockResolvedValue(
      Deck.create({
        userId: '123456',
        name: 'Deck name',
        description: 'Deck description'
      })
    )

    await expect(
      deleteDeckUseCase.execute({
        userId: 'different_user_id',
        deckId: '123456'
      })
    ).rejects.toThrow(DeckDoesNotBelongToTheUser)
  })

  it('should delete the deck', async () => {
    const deleteSpy = jest.spyOn(decksRepository, 'deleteById')
    jest.spyOn(usersRepository, 'findById').mockResolvedValue(
      User.create({
        name: 'Test User',
        email: 'testuser@email.com',
        password: '123456'
      })
    )

    jest.spyOn(decksRepository, 'findById').mockResolvedValue(
      Deck.create({
        userId: '123456',
        name: 'Deck name',
        description: 'Deck description'
      })
    )

    await expect(
      deleteDeckUseCase.execute({
        userId: '123456',
        deckId: '12345678'
      })
    ).resolves.toBeUndefined()

    expect(deleteSpy).toHaveBeenCalledWith('12345678')
  })
})