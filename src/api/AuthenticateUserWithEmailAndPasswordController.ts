import { AuthenticateUserWithEmailAndPasswordUseCase } from '@useCases/AuthenticateUserWithEmailAndPasswordUseCase'
import { Request } from 'express'
import { Controller, ControllerResponse } from './Controller'

export class AuthenticateUserWithEmailAndPasswordController extends Controller {
  constructor(private useCase: AuthenticateUserWithEmailAndPasswordUseCase) {
    super()
  }

  public async handle(request: Request): Promise<ControllerResponse> {
    const { email, password } = request.body

    const { user, token } = await this.useCase.execute({
      email,
      password
    })

    return super.ok({
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      },
      token
    })
  }
}
