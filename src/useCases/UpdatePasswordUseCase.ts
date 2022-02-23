import { HashProvider } from '@providers/HashProvider/HashProvider.interface'
import { UsersRepository } from '@repositories/UsersRepository'
import { UserNotFound } from './errors'
import { PasswordIncorrect } from './errors/PasswordIncorrect'
import { UseCase } from './UseCase.interface'

interface Request {
  userId: string
  currentPassword: string
  newPassword: string
}

export class UpdatePasswordUseCase implements UseCase<Request, void> {
  constructor(
    private usersRepository: UsersRepository,
    private hashProvider: HashProvider
  ) {}

  async execute({
    userId,
    currentPassword,
    newPassword
  }: Request): Promise<void> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      throw new UserNotFound()
    }

    const isCurrentPasswordCorrect = await this.hashProvider.compare({
      plainText: currentPassword,
      hashText: user.password
    })

    if (!isCurrentPasswordCorrect) {
      throw new PasswordIncorrect()
    }

    const hashedPassword = await this.hashProvider.hash(newPassword)

    user.updatePassword(hashedPassword)

    await this.usersRepository.save(user)
  }
}
