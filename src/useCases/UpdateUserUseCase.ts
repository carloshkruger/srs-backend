import { UsersRepository } from '@repositories/UsersRepository'
import { EmailAlreadyRegistered, UserNotFound } from '@useCases/errors'
import { UseCase } from '@useCases/UseCase.interface'

export interface Request {
  id: string
  name: string
  email: string
}

export class UpdateUserUseCase implements UseCase<Request, void> {
  constructor(private usersRepository: UsersRepository) {}

  async execute({ id, name, email }: Request): Promise<void> {
    const userById = await this.usersRepository.findById(id)

    if (!userById) {
      throw new UserNotFound()
    }

    const userByEmail = await this.usersRepository.findByEmail(email)

    if (userByEmail && userByEmail.id !== id) {
      throw new EmailAlreadyRegistered(email)
    }

    userById.updateName(name)
    userById.updateEmail(email)

    await this.usersRepository.save(userById)
  }
}
