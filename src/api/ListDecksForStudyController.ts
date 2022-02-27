import { ListDecksForStudyUseCase } from '@useCases/ListDecksForStudyUseCase'
import { Request } from 'express'
import { Controller, ControllerResponse } from './Controller'

export class ListDecksForStudyController extends Controller {
  constructor(private useCase: ListDecksForStudyUseCase) {
    super()
  }

  public async handle(request: Request): Promise<ControllerResponse> {
    const userId = request.user.id

    const { decks } = await this.useCase.execute({ userId })

    return super.ok({ decks })
  }
}
