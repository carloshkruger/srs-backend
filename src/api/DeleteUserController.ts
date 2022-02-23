import { DeleteUserUseCase } from '@useCases/DeleteUserUseCase'
import { Request } from 'express'
import { Controller, ControllerResponse } from './Controller'

export class DeleteUserController extends Controller {
  constructor(private useCase: DeleteUserUseCase) {
    super()
  }

  public async handle(request: Request): Promise<ControllerResponse> {
    const userId = request.user.id

    await this.useCase.execute({ userId })

    return super.noContent()
  }
}
