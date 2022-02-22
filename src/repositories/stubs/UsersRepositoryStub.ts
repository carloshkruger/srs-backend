import { User } from 'entities/User'
import { UsersRepository } from 'repositories/UsersRepository'

export class UsersRepositoryStub implements UsersRepository {
  async findByEmail(): Promise<User> {
    return Promise.resolve(undefined)
  }
  async save(): Promise<void> {
    return Promise.resolve(undefined)
  }
}
