import { CreateUserWithEmailAndPasswordController } from '@api/CreateUserWithEmailAndPassword'
import { DeleteUserController } from '@api/DeleteUserController'
import { UpdatePasswordController } from '@api/UpdatePasswordController'
import { UpdateUserController } from '@api/UpdateUser'
import { hashProvider } from '@providers/HashProvider'
import { storageProvider } from '@providers/StorageProvider'
import { usersRepository } from '@repositories/index'
import { CreateUserWithEmailAndPassword } from '@useCases/CreateUserWithEmailAndPassword'
import { DeleteUserUseCase } from '@useCases/DeleteUserUseCase'
import { UpdatePasswordUseCase } from '@useCases/UpdatePasswordUseCase'
import { UpdateUser } from '@useCases/UpdateUser'
import { celebrate, Segments } from 'celebrate'
import { Router } from 'express'
import Joi from 'joi'
import authorization from '../middlewares/authorization'

const usersRoutes = Router()

const createUserWithEmailAndPasswordUseCase =
  new CreateUserWithEmailAndPassword(usersRepository, hashProvider)
const createUserWithEmailAndPasswordController =
  new CreateUserWithEmailAndPasswordController(
    createUserWithEmailAndPasswordUseCase
  )

const updateUserUseCase = new UpdateUser(usersRepository)
const updateUserController = new UpdateUserController(updateUserUseCase)

const deleteUserUseCase = new DeleteUserUseCase(
  usersRepository,
  storageProvider
)
const deleteUserController = new DeleteUserController(deleteUserUseCase)

const updatePasswordUseCase = new UpdatePasswordUseCase(
  usersRepository,
  hashProvider
)
const updatePasswordController = new UpdatePasswordController(
  updatePasswordUseCase
)

const passwordValidation = Joi.string().min(6).required()

usersRoutes.post(
  '/users',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      password: passwordValidation
    }
  }),
  createUserWithEmailAndPasswordController.execute.bind(
    createUserWithEmailAndPasswordController
  )
)
usersRoutes.put(
  '/users/:id',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      email: Joi.string().email().required()
    },
    [Segments.PARAMS]: {
      id: Joi.string().uuid().required()
    }
  }),
  authorization(),
  updateUserController.execute.bind(updateUserController)
)
usersRoutes.delete(
  '/users/:id',
  authorization(),
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().uuid().required()
    }
  }),
  deleteUserController.execute.bind(deleteUserController)
)
usersRoutes.put(
  '/users/:id/password',
  authorization(),
  celebrate({
    [Segments.BODY]: {
      currentPassword: passwordValidation,
      newPassword: passwordValidation
    },
    [Segments.PARAMS]: {
      id: Joi.string().uuid().required()
    }
  }),
  updatePasswordController.execute.bind(updatePasswordController)
)

export { usersRoutes }
