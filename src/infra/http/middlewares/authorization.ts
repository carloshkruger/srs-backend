import { NextFunction, Request, Response } from 'express'

export default () => {
  return async (request: Request, response: Response, next: NextFunction) => {
    if (!request.user || !request.user.id) {
      return response.status(403).json({
        error: 'Access denied.'
      })
    }

    next()
  }
}
