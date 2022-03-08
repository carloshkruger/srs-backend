import { ControllerErrorResponse } from '@api/Controller'
import { Logger } from '@shared/Logger'
import { AppError } from '@useCases/errors/AppError'
import { CelebrateError, isCelebrateError } from 'celebrate'
import { Request, Response, NextFunction } from 'express'

export const errorHandler = (
  error: Error,
  request: Request,
  response: Response,
  next: NextFunction
) => {
  Logger.error(error)

  const { body, statusCode } = formatErrorMessage(error)

  return response.status(statusCode).json(body)
}

const formatErrorMessage = (error: Error): ControllerErrorResponse => {
  if (isCelebrateError(error)) {
    return {
      statusCode: 400,
      body: {
        error: [...(error as CelebrateError).details.values()].map(
          (error) => error.message
        )
      }
    }
  }

  if (error instanceof AppError) {
    return {
      statusCode: error.httpCode,
      body: {
        error: error.message
      }
    }
  }

  return {
    statusCode: 500,
    body: {
      error: 'Internal server error'
    }
  }
}
