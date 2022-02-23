import { CreateDeckUseCase } from '@useCases/CreateDeckUseCase'
import { Request } from 'express'
import { Controller, ControllerResponse } from './Controller'

export class CreateDeckController extends Controller {
  constructor(private useCase: CreateDeckUseCase) {
    super()
  }

  public async handle(request: Request): Promise<ControllerResponse> {
    const { name, description } = request.body
    const userId = request.user.id

    const deck = await this.useCase.execute({ userId, name, description })

    return super.created({
      id: deck.id,
      name: deck.name,
      description: deck.description
    })
  }
}
