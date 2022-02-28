import { PrismaClient } from '@prisma/client'

const prismaClient = new PrismaClient({
  log: ['info', 'query', 'warn', 'error']
})

const connect = async (): Promise<void> => {
  await prismaClient.$connect()
}

const disconnect = async (): Promise<void> => {
  await prismaClient.$disconnect()
}

export { prismaClient, connect, disconnect }
