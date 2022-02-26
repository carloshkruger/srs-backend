import { CreateCardReviewUseCase } from '@useCases/CreateCardReviewUseCase'
import { Request } from 'express'
import { Controller, ControllerResponse } from './Controller'

export class CreateCardReviewController extends Controller {
  constructor(private useCase: CreateCardReviewUseCase) {
    super()
  }

  public async handle(request: Request): Promise<ControllerResponse> {
    const { difficultyLevel } = request.body
    const cardId = request.params.id
    const userId = request.user.id

    const { nextReviewDate } = await this.useCase.execute({
      userId,
      cardId,
      difficultyLevel
    })

    return super.created({
      nextReviewDate
    })
  }
}
