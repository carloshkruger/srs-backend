import { User } from '@entities/User'
import { HashProvider } from '@providers/HashProvider/HashProvider.interface'
import { UsersRepository } from '@repositories/UsersRepository'
import { UseCase } from '@useCases/UseCase.interface'
import { EmailAlreadyRegistered } from './CreateUserWithEmailAndPassword.errors'
import { CreateUserWithEmailAndPasswordRequest } from './CreateUserWithEmailAndPassword.request'

export class CreateUserWithEmailAndPassword
  implements UseCase<CreateUserWithEmailAndPasswordRequest, User>
{
  constructor(
    private usersRepository: UsersRepository,
    private hashProvider: HashProvider
  ) {}

  async execute({
    name,
    email,
    password
  }: CreateUserWithEmailAndPasswordRequest): Promise<User> {
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
