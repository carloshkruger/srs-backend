import { prismaClient } from '@shared/PrismaUtils'

export const clearDatabase = async (): Promise<void> => {
  await prismaClient.user.deleteMany()
}
