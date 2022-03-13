import { FindDeckInfoUseCase } from '@useCases/FindDeckInfoUseCase'
import { Request } from 'express'
import { Controller, ControllerResponse } from './Controller'

export class FindDeckInfoController extends Controller {
  constructor(private useCase: FindDeckInfoUseCase) {
    super()
  }

  public async handle(request: Request): Promise<ControllerResponse> {
    const userId = request.user.id
    const id = request.params.id

    const deckInfo = await this.useCase.execute({ userId, id })

    return super.ok(deckInfo)
  }
}
