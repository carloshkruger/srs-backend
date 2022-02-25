import { UpdateCardUseCase } from '@useCases/UpdateCardUseCase'
import { Request } from 'express'
import { Controller, ControllerResponse } from './Controller'

export class UpdateCardController extends Controller {
  constructor(private useCase: UpdateCardUseCase) {
    super()
  }

  public async handle(request: Request): Promise<ControllerResponse> {
    const { originalText, translatedText } = request.body
    const cardId = request.params.id
    const userId = request.user.id

    await this.useCase.execute({
      userId,
      cardId,
      originalText,
      translatedText
    })

    return super.noContent()
  }
}
