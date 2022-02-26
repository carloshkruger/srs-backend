import { UserMockBuilder } from '@entities/mocks/UserMockBuilder'
import { UsersRepositoryStub } from '@repositories/stubs/UsersRepositoryStub'
import { UsersRepository } from '@repositories/UsersRepository'
import { DeleteUserUseCase } from './DeleteUserUseCase'
import { UserNotFound } from './errors'

describe('DeleteUserUseCase', () => {
  let deleteUserUseCase: DeleteUserUseCase
  let usersRepository: UsersRepository

  beforeEach(() => {
    usersRepository = new UsersRepositoryStub()
    deleteUserUseCase = new DeleteUserUseCase(usersRepository)
  })

  it('should throw an error if the user was not found', async () => {
    jest.spyOn(usersRepository, 'findById').mockResolvedValue(undefined)
    const deleteSpy = jest.spyOn(usersRepository, 'deleteById')

    await expect(
      deleteUserUseCase.execute({
        userId: '123456'
      })
    ).rejects.toThrow(UserNotFound)
    expect(deleteSpy).not.toHaveBeenCalled()
  })

  it('should delete the user', async () => {
    jest
      .spyOn(usersRepository, 'findById')
      .mockResolvedValue(UserMockBuilder.aUser().build())
    const deleteSpy = jest.spyOn(usersRepository, 'deleteById')

    await expect(
      deleteUserUseCase.execute({
        userId: '123456'
      })
    ).resolves.toBeUndefined()
    expect(deleteSpy).toHaveBeenCalledWith('123456')
  })
})
