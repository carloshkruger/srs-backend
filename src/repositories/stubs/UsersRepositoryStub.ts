import { User } from 'entities/User'
import { UsersRepository } from 'repositories/UsersRepository'

export class UsersRepositoryStub implements UsersRepository {
  async findById(): Promise<User> {
    return Promise.resolve(undefined)
  }
  async findByEmail(): Promise<User> {
    return Promise.resolve(undefined)
  }
  async save(): Promise<void> {
    return Promise.resolve(undefined)
  }
  async deleteById(): Promise<void> {
    return Promise.resolve(undefined)
  }
}
