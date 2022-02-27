import { User } from '@entities/User'
import { AuthTokenProvider } from '@providers/AuthTokenProvider/AuthTokenProvider.interface'
import { HashProvider } from '@providers/HashProvider/HashProvider.interface'
import { UsersRepository } from '@repositories/UsersRepository'
import { IncorrectCredentials } from './errors'
import { UseCase } from './UseCase.interface'

interface Request {
  email: string
  password: string
}

interface Response {
  user: User
  token: string
}

export class AuthenticateUserWithEmailAndPasswordUseCase
  implements UseCase<Request, Response>
{
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly hashProvider: HashProvider,
    private readonly authTokenProvider: AuthTokenProvider
  ) {}

  async execute({ email, password }: Request): Promise<Response> {
    const user = await this.usersRepository.findByEmail(email)

    if (!user) {
      throw new IncorrectCredentials()
    }

    const passwordMatched = await this.hashProvider.compare({
      hashText: user.password,
      plainText: password
    })

    if (!passwordMatched) {
      throw new IncorrectCredentials()
    }

    const token = this.authTokenProvider.generate(user.id)

    return {
      user,
      token
    }
  }
}
