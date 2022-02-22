import { User } from '@entities/User'
import { HashProvider } from '@providers/HashProvider/HashProvider.interface'
import { HashProviderStub } from '@providers/HashProvider/HashProviderStub'
import { UsersRepositoryStub } from '@repositories/stubs/UsersRepositoryStub'
import { UsersRepository } from '@repositories/UsersRepository'
import { CreateUserWithEmailAndPassword } from './CreateUserWithEmailAndPassword'
import { EmailAlreadyRegistered } from './CreateUserWithEmailAndPassword.errors'

describe('CreateUserWithEmailAndPassword', () => {
  let createUserWithEmailAndPassword: CreateUserWithEmailAndPassword
  let usersRepository: UsersRepository
  let hashProvider: HashProvider

  beforeEach(() => {
    usersRepository = new UsersRepositoryStub()
    hashProvider = new HashProviderStub()
    createUserWithEmailAndPassword = new CreateUserWithEmailAndPassword(
      usersRepository,
      hashProvider
    )
  })

  it('should not be possible to create an user with an e-mail already in use', async () => {
    const email = 'email_in_use@email.com'

    const user = User.create({
      email,
      name: 'test user',
      password: '123456'
    })

    jest.spyOn(usersRepository, 'findByEmail').mockResolvedValue(user)
    const saveSpy = jest.spyOn(usersRepository, 'save')
    const hashSpy = jest.spyOn(hashProvider, 'hash')

    await expect(
      createUserWithEmailAndPassword.execute({
        name: 'test user',
        email,
        password: '123456'
      })
    ).rejects.toThrow(new EmailAlreadyRegistered(email))
    expect(saveSpy).not.toHaveBeenCalled()
    expect(hashSpy).not.toHaveBeenCalled()
  })

  it('should create an user', async () => {
    jest.spyOn(usersRepository, 'findByEmail').mockResolvedValue(undefined)
    const saveSpy = jest.spyOn(usersRepository, 'save')
    const hashSpy = jest.spyOn(hashProvider, 'hash')

    const password = '123456'

    await expect(
      createUserWithEmailAndPassword.execute({
        name: 'test user',
        email: 'test_user@email.com',
        password
      })
    ).resolves.toBeInstanceOf(User)
    expect(saveSpy).toHaveBeenCalledTimes(1)
    expect(saveSpy).toHaveBeenCalledWith(expect.any(User))
    expect(hashSpy).toHaveBeenCalledTimes(1)
    expect(hashSpy).toHaveBeenCalledWith(password)

    const userPassedToSaveMethod = saveSpy.mock.calls[0][0]
    expect(userPassedToSaveMethod.password).not.toBe(password)
  })
})
