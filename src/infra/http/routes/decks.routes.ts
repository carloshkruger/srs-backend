import { CreateDeckController } from '@api/CreateDeckController'
import { DeleteDeckController } from '@api/DeleteDeckController'
import { ListDecksForStudyController } from '@api/ListDecksForStudyController'
import { UpdateDeckController } from '@api/UpdateDeckController'
import { StorageProviderStub } from '@providers/StorageProvider/StorageProviderStub'
import { PrismaDecksRepository } from '@repositories/prisma/PrismaDecksRepository'
import { PrismaUsersRepository } from '@repositories/prisma/PrismaUsersRepository'
import { CreateDeckUseCase } from '@useCases/CreateDeckUseCase'
import { DeleteDeckUseCase } from '@useCases/DeleteDeckUseCase'
import { ListDecksForStudyUseCase } from '@useCases/ListDecksForStudyUseCase'
import { UpdateDeckUseCase } from '@useCases/UpdateDeckUseCase'
import { celebrate, Segments } from 'celebrate'
import { Router } from 'express'
import Joi from 'joi'
import authorization from '../middlewares/authorization'

const decksRoutes = Router()

const usersRepositoryStub = new PrismaUsersRepository()
const decksRepositoryStub = new PrismaDecksRepository()
const storageProvider = new StorageProviderStub()

const createDeckUseCase = new CreateDeckUseCase(
  usersRepositoryStub,
  decksRepositoryStub
)
const createDeckController = new CreateDeckController(createDeckUseCase)

const updateDeckUseCase = new UpdateDeckUseCase(
  usersRepositoryStub,
  decksRepositoryStub
)
const updateDeckController = new UpdateDeckController(updateDeckUseCase)

const deleteDeckUseCase = new DeleteDeckUseCase(
  usersRepositoryStub,
  decksRepositoryStub,
  storageProvider
)
const deleteDeckController = new DeleteDeckController(deleteDeckUseCase)

const listDecksForStudyUseCase = new ListDecksForStudyUseCase(
  usersRepositoryStub,
  decksRepositoryStub
)
const listDecksForStudyController = new ListDecksForStudyController(
  listDecksForStudyUseCase
)

decksRoutes.use(authorization())

decksRoutes.post(
  '/decks/',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      description: Joi.string().required()
    }
  }),
  createDeckController.execute.bind(createDeckController)
)
decksRoutes.put(
  '/decks/:id',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      description: Joi.string().required()
    },
    [Segments.PARAMS]: {
      id: Joi.string().uuid().required()
    }
  }),
  updateDeckController.execute.bind(updateDeckController)
)
decksRoutes.delete(
  '/decks/:id',
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().uuid().required()
    }
  }),
  deleteDeckController.execute.bind(deleteDeckController)
)
decksRoutes.get(
  '/decks/study',
  listDecksForStudyController.execute.bind(listDecksForStudyController)
)

export { decksRoutes }
