import { CreateDeckController } from '@api/CreateDeckController'
import { DeleteDeckController } from '@api/DeleteDeckController'
import { ListDecksForStudyController } from '@api/ListDecksForStudyController'
import { UpdateDeckController } from '@api/UpdateDeckController'
import { DecksRepositoryStub } from '@repositories/stubs/DecksRepositoryStub'
import { UsersRepositoryStub } from '@repositories/stubs/UsersRepositoryStub'
import { CreateDeckUseCase } from '@useCases/CreateDeckUseCase'
import { DeleteDeckUseCase } from '@useCases/DeleteDeckUseCase'
import { ListDecksForStudyUseCase } from '@useCases/ListDecksForStudyUseCase'
import { UpdateDeckUseCase } from '@useCases/UpdateDeckUseCase'
import { Router } from 'express'

const decksRoutes = Router()

const usersRepositoryStub = new UsersRepositoryStub()
const decksRepositoryStub = new DecksRepositoryStub()

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
  decksRepositoryStub
)
const deleteDeckController = new DeleteDeckController(deleteDeckUseCase)

const listDecksForStudyUseCase = new ListDecksForStudyUseCase(
  usersRepositoryStub,
  decksRepositoryStub
)
const listDecksForStudyController = new ListDecksForStudyController(
  listDecksForStudyUseCase
)

decksRoutes.post(
  '/decks/',
  createDeckController.execute.bind(createDeckController)
)
decksRoutes.put(
  '/decks/:id',
  updateDeckController.execute.bind(updateDeckController)
)
decksRoutes.delete(
  '/decks/:id',
  deleteDeckController.execute.bind(deleteDeckController)
)
decksRoutes.get(
  '/decks/study',
  listDecksForStudyController.execute.bind(listDecksForStudyController)
)

export { decksRoutes }
