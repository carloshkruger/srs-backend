import { DeleteDeckUseCase } from '@useCases/DeleteDeckUseCase'
import { Request } from 'express'
import { Controller, ControllerResponse } from './Controller'

export class DeleteDeckController extends Controller {
  constructor(private useCase: DeleteDeckUseCase) {
    super()
  }

  public async handle(request: Request): Promise<ControllerResponse> {
    const deckId = request.params.id
    const userId = request.user.id

    await this.useCase.execute({
      userId,
      deckId
    })

    return super.noContent()
  }
}
