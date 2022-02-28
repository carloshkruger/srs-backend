import { User } from '@entities/User'
import { UsersRepository } from '@repositories/UsersRepository'
import { prismaClient } from '@shared/PrismaUtils'
import { User as PrismaUserModel } from '@prisma/client'

export class PrismaUsersRepository implements UsersRepository {
  async findById(id: string): Promise<User> {
    const model = await prismaClient.user.findUnique({
      where: {
        id
      }
    })

    return this.mapUserToDomain(model)
  }

  async findByEmail(email: string): Promise<User> {
    const model = await prismaClient.user.findFirst({
      where: {
        email
      }
    })

    return this.mapUserToDomain(model)
  }

  async save(user: User): Promise<void> {
    const userModel = {
      name: user.name,
      email: user.email,
      password: user.password
    }

    await prismaClient.user.upsert({
      create: {
        ...userModel,
        id: user.id
      },
      update: userModel,
      where: {
        id: user.id
      }
    })
  }

  async deleteById(id: string): Promise<void> {
    await prismaClient.user.delete({
      where: {
        id
      }
    })
  }

  private mapUserToDomain(model: PrismaUserModel): User {
    if (!model) {
      return undefined
    }

    return User.create(
      {
        email: model.email,
        name: model.name,
        password: model.password
      },
      model.id
    )
  }
}
