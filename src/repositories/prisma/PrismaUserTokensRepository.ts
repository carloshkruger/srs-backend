import { UserToken } from '@entities/UserToken'
import { UserTokensRepository } from '@repositories/UserTokensRepository'
import { prismaClient } from '@shared/PrismaUtils'

export class PrismaUserTokensRepository implements UserTokensRepository {
  async save(userToken: UserToken): Promise<void> {
    await prismaClient.userToken.create({
      data: {
        id: userToken.id,
        token: userToken.token,
        userId: userToken.userId,
        createdAt: userToken.createdAt
      }
    })
  }

  async findByToken(token: string): Promise<UserToken> {
    const model = await prismaClient.userToken.findFirst({
      where: {
        token
      }
    })

    if (!model) {
      return undefined
    }

    return UserToken.create(
      {
        userId: model.userId,
        token: model.token,
        createdAt: model.createdAt
      },
      model.id
    )
  }

  async deleteById(id: string): Promise<void> {
    await prismaClient.userToken.delete({
      where: {
        id
      }
    })
  }
}
