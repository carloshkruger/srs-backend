import { UpdateUserUseCase } from '@useCases/UpdateUserUseCase'
import { Request } from 'express'
import { Controller, ControllerResponse } from './Controller'

export class UpdateUserController extends Controller {
  constructor(private useCase: UpdateUserUseCase) {
    super()
  }

  public async handle(request: Request): Promise<ControllerResponse> {
    const { id } = request.params
    const { name, email } = request.body

    await this.useCase.execute({ id, name, email })

    return super.noContent()
  }
}
