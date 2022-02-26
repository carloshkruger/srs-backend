import { SendForgotPasswordEmailUseCase } from '@useCases/SendForgotPasswordEmailUseCase'
import { Request } from 'express'
import { Controller, ControllerResponse } from './Controller'

export class SendForgotPasswordEmailController extends Controller {
  constructor(private useCase: SendForgotPasswordEmailUseCase) {
    super()
  }

  public async handle(request: Request): Promise<ControllerResponse> {
    const { email } = request.body

    await this.useCase.execute({
      email
    })

    return super.noContent()
  }
}
