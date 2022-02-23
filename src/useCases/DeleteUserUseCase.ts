import { UsersRepository } from '@repositories/UsersRepository'
import { UserNotFound } from './errors'
import { UseCase } from './UseCase.interface'

interface Request {
  userId: string
}

export class DeleteUserUseCase implements UseCase<Request, void> {
  constructor(private usersRepository: UsersRepository) {}

  async execute({ userId }: Request): Promise<void> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      throw new UserNotFound()
    }

    await this.usersRepository.deleteById(userId)
  }
}
