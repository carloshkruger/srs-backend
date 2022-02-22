import { CreateUserWithEmailAndPassword } from '@useCases/CreateUserWithEmailAndPassword'
import { Request } from 'express'
import { Controller, ControllerResponse } from './Controller'

export class CreateUserWithEmailAndPasswordController extends Controller {
  constructor(private useCase: CreateUserWithEmailAndPassword) {
    super()
  }

  public async handle(request: Request): Promise<ControllerResponse> {
    const { name, email, password } = request.body

    const user = await this.useCase.execute({ name, email, password })

    return super.created({
      id: user.id
    })
  }
}
