import { UpdatePasswordUseCase } from '@useCases/UpdatePasswordUseCase'
import { Request } from 'express'
import { Controller, ControllerResponse } from './Controller'

export class UpdatePasswordController extends Controller {
  constructor(private useCase: UpdatePasswordUseCase) {
    super()
  }

  public async handle(request: Request): Promise<ControllerResponse> {
    const { currentPassword, newPassword } = request.body
    const userId = request.user.id

    await this.useCase.execute({
      userId,
      currentPassword,
      newPassword
    })

    return super.noContent()
  }
}
