import { ResetPasswordUseCase } from '@useCases/ResetPasswordUseCase'
import { Request } from 'express'
import { Controller, ControllerResponse } from './Controller'

export class ResetPasswordController extends Controller {
  constructor(private useCase: ResetPasswordUseCase) {
    super()
  }

  public async handle(request: Request): Promise<ControllerResponse> {
    const { token, password } = request.body

    await this.useCase.execute({
      token,
      password
    })

    return super.noContent()
  }
}
