import { UserToken } from '@entities/UserToken'
import { UserTokensRepository } from '@repositories/UserTokensRepository'

export class UserTokensRepositoryStub implements UserTokensRepository {
  save(): Promise<void> {
    return Promise.resolve(undefined)
  }
  findByIdToken(): Promise<UserToken> {
    return Promise.resolve(undefined)
  }
}
