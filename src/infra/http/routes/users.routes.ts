import { CreateUserWithEmailAndPasswordController } from '@api/CreateUserWithEmailAndPassword'
import { DeleteUserController } from '@api/DeleteUserController'
import { UpdatePasswordController } from '@api/UpdatePasswordController'
import { UpdateUserController } from '@api/UpdateUser'
import { BCryptHashProvider } from '@providers/HashProvider/BCryptHashProvider'
import { StorageProviderStub } from '@providers/StorageProvider/StorageProviderStub'
import { PrismaUsersRepository } from '@repositories/prisma/PrismaUsersRepository'
import { CreateUserWithEmailAndPassword } from '@useCases/CreateUserWithEmailAndPassword'
import { DeleteUserUseCase } from '@useCases/DeleteUserUseCase'
import { UpdatePasswordUseCase } from '@useCases/UpdatePasswordUseCase'
import { UpdateUser } from '@useCases/UpdateUser'
import { Router } from 'express'

const usersRoutes = Router()

const usersRepository = new PrismaUsersRepository()
const hashProvider = new BCryptHashProvider()
const storageProvider = new StorageProviderStub()

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

usersRoutes.post(
  '/users/',
  createUserWithEmailAndPasswordController.execute.bind(
    createUserWithEmailAndPasswordController
  )
)
usersRoutes.put(
  '/users/:id',
  updateUserController.execute.bind(updateUserController)
)
usersRoutes.delete(
  '/users/:id',
  deleteUserController.execute.bind(deleteUserController)
)
usersRoutes.put(
  '/users/:id/password',
  updatePasswordController.execute.bind(updatePasswordController)
)

export { usersRoutes }
