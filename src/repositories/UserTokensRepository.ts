import { UserToken } from '@entities/UserToken'

export interface UserTokensRepository {
  save(userToken: UserToken): Promise<void>
  findByToken(token: string): Promise<UserToken>
  deleteById(id: string): Promise<void>
}
