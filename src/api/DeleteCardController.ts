import { DeleteCardUseCase } from '@useCases/DeleteCardUseCase'
import { Request } from 'express'
import { Controller, ControllerResponse } from './Controller'

export class DeleteCardController extends Controller {
  constructor(private useCase: DeleteCardUseCase) {
    super()
  }

  public async handle(request: Request): Promise<ControllerResponse> {
    const userId = request.user.id
    const cardId = request.params.id

    await this.useCase.execute({
      userId,
      cardId
    })

    return super.noContent()
  }
}
