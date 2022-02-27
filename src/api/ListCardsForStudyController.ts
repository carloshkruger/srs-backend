import { ListCardsForStudyUseCase } from '@useCases/ListCardsForStudyUseCase'
import { Request } from 'express'
import { Controller, ControllerResponse } from './Controller'

export class ListCardsForStudyController extends Controller {
  constructor(private useCase: ListCardsForStudyUseCase) {
    super()
  }

  public async handle(request: Request): Promise<ControllerResponse> {
    const deckId = request.query.deckId
      ? String(request.query.deckId)
      : undefined
    const userId = request.user.id

    const { cards } = await this.useCase.execute({
      userId,
      deckId
    })

    return super.ok({
      cards: cards.map((card) => ({
        id: card.id,
        deckId: card.deckId,
        originalText: card.originalText,
        translatedText: card.translatedText,
        audioFileName: card.audioFileName
      }))
    })
  }
}
