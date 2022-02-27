import { ListAllDeckCardsUseCase } from '@useCases/ListAllDeckCardsUseCase'
import { Request } from 'express'
import { Controller, ControllerResponse } from './Controller'

export class ListAllDeckCardsController extends Controller {
  constructor(private useCase: ListAllDeckCardsUseCase) {
    super()
  }

  public async handle(request: Request): Promise<ControllerResponse> {
    const userId = request.user.id
    const deckId = request.params.id

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
        audioFileName: card.audioFileName,
        nextReviewAt: card.nextReviewAt
      }))
    })
  }
}
