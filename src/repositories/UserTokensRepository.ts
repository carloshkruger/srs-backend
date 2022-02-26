import { UserToken } from '@entities/UserToken'

export interface UserTokensRepository {
  save(userToken: UserToken): Promise<void>
  findByIdToken(token: string): Promise<UserToken>
}
