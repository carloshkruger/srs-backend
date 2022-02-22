import { UsersRepository } from '@repositories/UsersRepository'
import { EmailAlreadyRegistered } from '@useCases/CreateUserWithEmailAndPassword/CreateUserWithEmailAndPassword.errors'
import { UseCase } from '@useCases/UseCase.interface'
import { UserNotFound } from './UpdateUser.errors'
import { UpdateUserRequest } from './UpdateUser.request'

export class UpdateUser implements UseCase<UpdateUserRequest, void> {
  constructor(private usersRepository: UsersRepository) {}

  async execute({ id, name, email }: UpdateUserRequest): Promise<void> {
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
