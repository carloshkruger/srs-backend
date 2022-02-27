import { CreateUserWithEmailAndPasswordController } from '@api/CreateUserWithEmailAndPassword'
import { DeleteUserController } from '@api/DeleteUserController'
import { UpdatePasswordController } from '@api/UpdatePasswordController'
import { UpdateUserController } from '@api/UpdateUser'
import { HashProviderStub } from '@providers/HashProvider/HashProviderStub'
import { UsersRepositoryStub } from '@repositories/stubs/UsersRepositoryStub'
import { CreateUserWithEmailAndPassword } from '@useCases/CreateUserWithEmailAndPassword'
import { DeleteUserUseCase } from '@useCases/DeleteUserUseCase'
import { UpdatePasswordUseCase } from '@useCases/UpdatePasswordUseCase'
import { UpdateUser } from '@useCases/UpdateUser'
import { Router } from 'express'

const usersRoutes = Router()

const usersRepositoryStub = new UsersRepositoryStub()
const hashProviderStub = new HashProviderStub()

const createUserWithEmailAndPasswordUseCase =
  new CreateUserWithEmailAndPassword(usersRepositoryStub, hashProviderStub)
const createUserWithEmailAndPasswordController =
  new CreateUserWithEmailAndPasswordController(
    createUserWithEmailAndPasswordUseCase
  )

const updateUserUseCase = new UpdateUser(usersRepositoryStub)
const updateUserController = new UpdateUserController(updateUserUseCase)

const deleteUserUseCase = new DeleteUserUseCase(usersRepositoryStub)
const deleteUserController = new DeleteUserController(deleteUserUseCase)

const updatePasswordUseCase = new UpdatePasswordUseCase(
  usersRepositoryStub,
  hashProviderStub
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
