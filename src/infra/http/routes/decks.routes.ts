import { CreateDeckController } from '@api/CreateDeckController'
import { DeleteDeckController } from '@api/DeleteDeckController'
import { ListDecksForStudyController } from '@api/ListDecksForStudyController'
import { UpdateDeckController } from '@api/UpdateDeckController'
import { storageProvider } from '@providers/StorageProvider'
import { usersRepository, decksRepository } from '@repositories/index'
import { CreateDeckUseCase } from '@useCases/CreateDeckUseCase'
import { DeleteDeckUseCase } from '@useCases/DeleteDeckUseCase'
import { ListDecksForStudyUseCase } from '@useCases/ListDecksForStudyUseCase'
import { UpdateDeckUseCase } from '@useCases/UpdateDeckUseCase'
import { celebrate, Segments } from 'celebrate'
import { Router } from 'express'
import Joi from 'joi'
import authorization from '../middlewares/authorization'

const decksRoutes = Router()

const createDeckUseCase = new CreateDeckUseCase(
  usersRepository,
  decksRepository
)
const createDeckController = new CreateDeckController(createDeckUseCase)

const updateDeckUseCase = new UpdateDeckUseCase(
  usersRepository,
  decksRepository
)
const updateDeckController = new UpdateDeckController(updateDeckUseCase)

const deleteDeckUseCase = new DeleteDeckUseCase(
  usersRepository,
  decksRepository,
  storageProvider
)
const deleteDeckController = new DeleteDeckController(deleteDeckUseCase)

const listDecksForStudyUseCase = new ListDecksForStudyUseCase(
  usersRepository,
  decksRepository
)
const listDecksForStudyController = new ListDecksForStudyController(
  listDecksForStudyUseCase
)

decksRoutes.use('/decks', authorization())

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
