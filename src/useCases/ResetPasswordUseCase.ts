import { HashProvider } from '@providers/HashProvider/HashProvider.interface'
import { UsersRepository } from '@repositories/UsersRepository'
import { UserTokensRepository } from '@repositories/UserTokensRepository'
import { TokenExpired, TokenNotFound, UserNotFound } from './errors'
import { UseCase } from './UseCase.interface'

interface Request {
  token: string
  password: string
}

export class ResetPasswordUseCase implements UseCase<Request, void> {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly userTokensRepository: UserTokensRepository,
    private readonly hashProvider: HashProvider
  ) {}

  async execute({ token, password }: Request): Promise<void> {
    const userToken = await this.userTokensRepository.findByToken(token)

    if (!userToken) {
      throw new TokenNotFound()
    }

    if (userToken.isTokenExpired()) {
      throw new TokenExpired()
    }

    const user = await this.usersRepository.findById(userToken.userId)

    if (!user) {
      throw new UserNotFound()
    }

    const hashedPassword = await this.hashProvider.hash(password)

    user.updatePassword(hashedPassword)

    await this.usersRepository.save(user)
    await this.userTokensRepository.deleteById(userToken.id)
  }
}
