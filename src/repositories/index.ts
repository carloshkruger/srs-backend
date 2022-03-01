import { PrismaCardsRepository } from './prisma/PrismaCardsRepository'
import { PrismaDecksRepository } from './prisma/PrismaDecksRepository'
import { PrismaUsersRepository } from './prisma/PrismaUsersRepository'
import { PrismaUserTokensRepository } from './prisma/PrismaUserTokensRepository'

const cardsRepository = new PrismaCardsRepository()
const decksRepository = new PrismaDecksRepository()
const usersRepository = new PrismaUsersRepository()
const userTokensRepository = new PrismaUserTokensRepository()

export {
  cardsRepository,
  decksRepository,
  usersRepository,
  userTokensRepository
}
