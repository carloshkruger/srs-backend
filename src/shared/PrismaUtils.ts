import { PrismaClient } from '@prisma/client'

const prismaClient = new PrismaClient()

const connect = async (): Promise<void> => {
  await prismaClient.$connect()
}

const disconnect = async (): Promise<void> => {
  await prismaClient.$disconnect()
}

export { prismaClient, connect, disconnect }
