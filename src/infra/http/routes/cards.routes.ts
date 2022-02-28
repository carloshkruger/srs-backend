import { CreateCardController } from '@api/CreateCardController'
import { CreateCardReviewController } from '@api/CreateCardReviewController'
import { DeleteCardController } from '@api/DeleteCardController'
import { ListCardsForStudyController } from '@api/ListCardsForStudyController'
import { UpdateCardController } from '@api/UpdateCardController'
import { StorageProviderStub } from '@providers/StorageProvider/StorageProviderStub'
import { TextToSpeechProviderStub } from '@providers/TextToSpeechProvider/TextToSpeechProviderStub'
import { PrismaCardsRepository } from '@repositories/prisma/PrismaCardsRepository'
import { PrismaDecksRepository } from '@repositories/prisma/PrismaDecksRepository'
import { PrismaUsersRepository } from '@repositories/prisma/PrismaUsersRepository'
import { CreateCardReviewUseCase } from '@useCases/CreateCardReviewUseCase'
import { CreateCardUseCase } from '@useCases/CreateCardUseCase'
import { DeleteCardUseCase } from '@useCases/DeleteCardUseCase'
import { ListCardsForStudyUseCase } from '@useCases/ListCardsForStudyUseCase'
import { UpdateCardUseCase } from '@useCases/UpdateCardUseCase'
import { Router } from 'express'

const cardsRoutes = Router()

const usersRepository = new PrismaUsersRepository()
const decksRepository = new PrismaDecksRepository()
const cardsRepository = new PrismaCardsRepository()
const textToSpeechProvider = new TextToSpeechProviderStub()
const storageProvider = new StorageProviderStub()
const createCardUseCase = new CreateCardUseCase(
  decksRepository,
  cardsRepository,
  textToSpeechProvider,
  storageProvider
)
const createCardController = new CreateCardController(createCardUseCase)

const updateCardUseCase = new UpdateCardUseCase(
  decksRepository,
  cardsRepository,
  textToSpeechProvider,
  storageProvider
)
const updateCardController = new UpdateCardController(updateCardUseCase)

const deleteCardUseCase = new DeleteCardUseCase(
  decksRepository,
  cardsRepository,
  storageProvider
)
const deleteCardController = new DeleteCardController(deleteCardUseCase)

const createCardReviewUseCase = new CreateCardReviewUseCase(
  usersRepository,
  cardsRepository,
  decksRepository
)
const createCardReviewController = new CreateCardReviewController(
  createCardReviewUseCase
)

const listCardsForStudyUseCase = new ListCardsForStudyUseCase(
  usersRepository,
  decksRepository,
  cardsRepository
)
const listCardsForStudyController = new ListCardsForStudyController(
  listCardsForStudyUseCase
)

cardsRoutes.post(
  '/cards/',
  createCardController.execute.bind(createCardController)
)
cardsRoutes.put(
  '/cards/:id',
  updateCardController.execute.bind(updateCardController)
)
cardsRoutes.delete(
  '/cards/:id',
  deleteCardController.execute.bind(deleteCardController)
)
cardsRoutes.post(
  '/cards/:id/review',
  createCardReviewController.execute.bind(createCardReviewController)
)
cardsRoutes.get(
  '/cards/study',
  listCardsForStudyController.execute.bind(listCardsForStudyController)
)

export { cardsRoutes }
