import { User } from '@entities/User'
import { UsersRepositoryStub } from '@repositories/stubs/UsersRepositoryStub'
import { UsersRepository } from '@repositories/UsersRepository'
import { EmailAlreadyRegistered, UserNotFound } from './errors'
import { UpdateUser } from './UpdateUser'

describe('UpdateUser', () => {
  let updateUser: UpdateUser
  let usersRepository: UsersRepository

  beforeEach(() => {
    usersRepository = new UsersRepositoryStub()
    updateUser = new UpdateUser(usersRepository)
  })

  it('should throw an error if the user was not found', async () => {
    jest.spyOn(usersRepository, 'findById').mockResolvedValue(undefined)
    const saveSpy = jest.spyOn(usersRepository, 'save')

    await expect(
      updateUser.execute({
        id: '123123',
        name: 'user test',
        email: 'usertest@email.com'
      })
    ).rejects.toThrow(UserNotFound)
    expect(saveSpy).not.toHaveBeenCalled()
  })

  it('should throw an error if the new email is already in use by another user', async () => {
    const userId = '123'
    const secondUserId = '1234'

    jest.spyOn(usersRepository, 'findById').mockResolvedValue(
      User.create(
        {
          name: 'user test',
          email: 'usertest@email.com'
        },
        userId
      )
    )
    jest.spyOn(usersRepository, 'findByEmail').mockResolvedValue(
      User.create(
        {
          name: 'user test',
          email: 'usertest@email.com'
        },
        secondUserId
      )
    )
    const saveSpy = jest.spyOn(usersRepository, 'save')

    await expect(
      updateUser.execute({
        id: userId,
        name: 'user test',
        email: 'usertest@email.com'
      })
    ).rejects.toThrow(EmailAlreadyRegistered)
    expect(saveSpy).not.toHaveBeenCalled()
  })

  it('should not throw an error if the new email is already in use by this user', async () => {
    const userId = '123'

    jest.spyOn(usersRepository, 'findById').mockResolvedValue(
      User.create(
        {
          name: 'user test',
          email: 'usertest@email.com'
        },
        userId
      )
    )
    jest.spyOn(usersRepository, 'findByEmail').mockResolvedValue(
      User.create(
        {
          name: 'user test',
          email: 'usertest@email.com'
        },
        userId
      )
    )
    const saveSpy = jest.spyOn(usersRepository, 'save')

    await expect(
      updateUser.execute({
        id: userId,
        name: 'user test',
        email: 'newemail@email.com'
      })
    ).resolves.toBeUndefined()
    expect(saveSpy).toHaveBeenCalled()
  })
})
