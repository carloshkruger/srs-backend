import { CreateCardUseCase } from '@useCases/CreateCardUseCase'
import { Request } from 'express'
import { Controller, ControllerResponse } from './Controller'

export class CreateCardController extends Controller {
  constructor(private useCase: CreateCardUseCase) {
    super()
  }

  public async handle(request: Request): Promise<ControllerResponse> {
    const { deckId, originalText, translatedText } = request.body

    const card = await this.useCase.execute({
      deckId,
      originalText,
      translatedText
    })

    return super.created({
      id: card.id,
      deckId: card.deckId,
      originalText: card.originalText,
      translatedText: card.translatedText
    })
  }
}
