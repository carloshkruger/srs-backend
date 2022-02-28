import { JWTAuthTokenProvider } from '@providers/AuthTokenProvider/JWTAuthTokenProvider'
import { PrismaUsersRepository } from '@repositories/prisma/PrismaUsersRepository'
import { NextFunction, Request, Response } from 'express'

const authTokenProvider = new JWTAuthTokenProvider()
const usersRepository = new PrismaUsersRepository()

export default async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const authorization = request.headers.authorization

    if (!authorization) {
      return next()
    }

    const [, accessToken] = authorization.split(' ')

    if (!accessToken) {
      return next()
    }

    let userId

    try {
      const data = authTokenProvider.decrypt(accessToken)
      userId = data.userId
    } catch {
      return next()
    }

    if (!userId) {
      return next()
    }

    const user = await usersRepository.findById(userId)

    if (!user) {
      return next()
    }

    request.user = {
      id: user.id
    }

    return next()
  } catch (error) {
    next(error)
  }
}
