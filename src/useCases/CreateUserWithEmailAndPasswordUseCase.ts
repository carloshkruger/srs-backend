import { User } from '@entities/User'
import { HashProvider } from '@providers/HashProvider/HashProvider.interface'
import { UsersRepository } from '@repositories/UsersRepository'
import { EmailAlreadyRegistered } from '@useCases/errors'
import { UseCase } from '@useCases/UseCase.interface'

export interface Request {
  name: string
  email: string
  password: string
}

export class CreateUserWithEmailAndPasswordUseCase
  implements UseCase<Request, User>
{
  constructor(
    private usersRepository: UsersRepository,
    private hashProvider: HashProvider
  ) {}

  async execute({ name, email, password }: Request): Promise<User> {
    const userByEmail = await this.usersRepository.findByEmail(email)

    if (userByEmail) {
      throw new EmailAlreadyRegistered(email)
    }

    const hashedPassword = await this.hashProvider.hash(password)

    const user = User.create({
      name,
      email,
      password: hashedPassword
    })

    await this.usersRepository.save(user)

    return user
  }
}
