import { CreateCardController } from '@api/CreateCardController'
import { CreateCardReviewController } from '@api/CreateCardReviewController'
import { DeleteCardController } from '@api/DeleteCardController'
import { ListCardsForStudyController } from '@api/ListCardsForStudyController'
import { UpdateCardController } from '@api/UpdateCardController'
import { CardReviewDifficultyLevel } from '@entities/enums/CardReviewDifficultyLevel'
import { storageProvider } from '@providers/StorageProvider'
import { textToSpeechProvider } from '@providers/TextToSpeechProvider'
import {
  decksRepository,
  cardsRepository,
  usersRepository
} from '@repositories/index'
import { CreateCardReviewUseCase } from '@useCases/CreateCardReviewUseCase'
import { CreateCardUseCase } from '@useCases/CreateCardUseCase'
import { DeleteCardUseCase } from '@useCases/DeleteCardUseCase'
import { ListCardsForStudyUseCase } from '@useCases/ListCardsForStudyUseCase'
import { UpdateCardUseCase } from '@useCases/UpdateCardUseCase'
import { celebrate, Segments } from 'celebrate'
import { Router } from 'express'
import Joi from 'joi'
import authorization from '../middlewares/authorization'

const cardsRoutes = Router()

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

cardsRoutes.use('/cards', authorization())

cardsRoutes.post(
  '/cards/',
  celebrate({
    [Segments.BODY]: {
      deckId: Joi.string().uuid().required(),
      originalText: Joi.string().max(200).required(),
      translatedText: Joi.string().required()
    }
  }),
  createCardController.execute.bind(createCardController)
)
cardsRoutes.put(
  '/cards/:id',
  celebrate({
    [Segments.BODY]: {
      deckId: Joi.string().uuid().required(),
      originalText: Joi.string().max(200).required(),
      translatedText: Joi.string().required()
    },
    [Segments.PARAMS]: {
      id: Joi.string().uuid().required()
    }
  }),
  updateCardController.execute.bind(updateCardController)
)
cardsRoutes.delete(
  '/cards/:id',
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().uuid().required()
    }
  }),
  deleteCardController.execute.bind(deleteCardController)
)
cardsRoutes.post(
  '/cards/:id/review',
  celebrate({
    [Segments.BODY]: {
      difficultyLevel: Joi.number()
        .valid(...Object.values(CardReviewDifficultyLevel))
        .required()
    },
    [Segments.PARAMS]: {
      id: Joi.string().uuid().required()
    }
  }),
  createCardReviewController.execute.bind(createCardReviewController)
)
cardsRoutes.get(
  '/cards/study',
  celebrate({
    [Segments.QUERY]: {
      deckId: Joi.string().uuid().optional()
    }
  }),
  listCardsForStudyController.execute.bind(listCardsForStudyController)
)

export { cardsRoutes }
