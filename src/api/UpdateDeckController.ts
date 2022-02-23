import { UpdateDeckUseCase } from '@useCases/UpdateDeckUseCase'
import { Request } from 'express'
import { Controller, ControllerResponse } from './Controller'

export class UpdateDeckController extends Controller {
  constructor(private useCase: UpdateDeckUseCase) {
    super()
  }

  public async handle(request: Request): Promise<ControllerResponse> {
    const { name, description } = request.body
    const deckId = request.params.id
    const userId = request.user.id

    await this.useCase.execute({
      userId,
      deckId,
      name,
      description
    })

    return super.noContent()
  }
}
